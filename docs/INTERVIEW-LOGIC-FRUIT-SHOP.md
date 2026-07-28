# Fruit Shop — Logic ทีละส่วน (สำหรับสัมภาษณ์)

> คู่กับ `INTERVIEW-QA-FRUIT-SHOP.md` — ไฟล์นี้โฟกัส **logic / business rules / เงื่อนไข if-else** ว่าทำไมถึงทำแบบนี้

---

## สารบัญ

1. [Auth-Service Logic](#1-auth-service-logic)
2. [Api-Gateway Logic](#2-api-gateway-logic)
3. [commerce-api: Products](#3-commerce-api-products)
4. [commerce-api: Cart](#4-commerce-api-cart)
5. [commerce-api: Orders](#5-commerce-api-orders)
6. [commerce-api: Payments](#6-commerce-api-payments)
7. [notification-service Logic](#7-notification-service-logic)
8. [Frontend Logic](#8-frontend-logic)
9. [Logic Map ภาพรวม](#9-logic-map-ภาพรวม)
10. [คำถามสัมภาษณ์เรื่อง Logic](#10-คำถามสัมภาษณ์เรื่อง-logic)

---

## 1. Auth-Service Logic

### Register

```
INPUT: email, password

LOGIC:
1. findByEmail(email)
   → เจอ → throw ConflictException (email ซ้ำ)
   → ไม่เจอ → ต่อ
2. bcrypt.hash(password, 10)
3. save user { email, password: hash, role: 'user' }
4. return { id, email, role }  // ไม่คืน password
```

**ทำไมเช็ค email ซ้ำ?** หนึ่ง email ต่อหนึ่ง account

---

### Login

```
INPUT: email, password

LOGIC:
1. findByEmail(email) where isActive: true
   → ไม่เจอ → NotFoundException
2. bcrypt.compare(plain, hash)
   → false → UnauthorizedException
3. generateTokens(userId, email, role)
   - access:  JWT_SECRET, expires 15m
   - refresh: REFRESH_TOKEN_SECRET, expires 1h
4. saveRefreshToken(userId, refresh_token)  // hash ก่อนเก็บ
5. return { access_token, refresh_token }
```

**ทำไมแยก secret 2 ตัว?** ถ้า access รั่ว คนร้ายเอาไป refresh ไม่ได้ (ต้องใช้ refresh token + secret คนละตัว)

---

### Refresh

```
INPUT: userId, refreshToken

LOGIC:
1. findById(userId)
   → ไม่มี refreshToken ใน DB → NotFoundException
2. bcrypt.compare(refreshToken, user.refreshToken)
   → ไม่ตรง → NotFoundException
3. generateTokens() ใหม่ทั้งคู่
4. saveRefreshToken() ทับของเก่า (token rotation)
5. return tokens ใหม่
```

**ทำไม rotate refresh?** ลดความเสี่ยงถ้า refresh token ถูกขโมย — ใช้ได้ครั้งเดียวแล้วถูกทับ

---

### Verify (Gateway เรียก)

```
INPUT: token

LOGIC:
try:
  jwtService.verify(token, JWT_SECRET)
  → return { valid: true, payload: { sub, email, role } }
catch:
  → return { valid: false, payload: null }  // ไม่ throw — ให้ Gateway ตัดสิน
```

**ทำไมไม่ throw?** Gateway ต้องการผลลัพธ์ boolean ไม่ใช่ error 500

---

### Logout

```
INPUT: userId (จาก JWT ที่ verify แล้ว)

LOGIC:
saveRefreshToken(userId, null)
→ refresh ใช้ต่อไม่ได้
→ access ยังอยู่จนกว่า exp (15 นาที) แล้วหมดเอง
```

---

## 2. Api-Gateway Logic

### Public route (login, register, refresh, verify)

```
LOGIC:
AuthProxyController รับ request
→ AuthProxyService.forward() ยิง HTTP ไป Auth-Service
→ ได้ response/error ส่งกลับ frontend
→ ไม่มี GatewayAuthGuard
```

---

### Protected route (cart, orders, payments, admin products)

```
LOGIC:
1. GatewayAuthGuard:
   - ไม่มี Bearer token → 401
   - verify(token) ที่ Auth-Service
   - valid: false → 401
   - valid: true → req.user = { userId, email, role }

2. CommerceProxyService.forward():
   - ส่ง HTTP ไป commerce-api
   - แนบ headers:
     x-user-id: userId
     x-user-email: email
     x-user-role: role
```

**ทำไมไม่ส่ง JWT ต่อไป commerce?** commerce ไม่ต้องรู้ JWT — แค่รู้ว่าใครใช้ (Gateway รับผิดชอบ verify แล้ว)

---

### Notification proxy (ต่างจาก commerce)

```
LOGIC:
- ส่ง Bearer token ต่อไป notification-service โดยตรง
- ไม่ใช้ x-user headers
→ เพราะ notification-service verify JWT เองด้วย Passport
```

---

## 3. commerce-api: Products

### GET /products (public)

```
LOGIC:
find({ isActive: true })
→ ซ่อนสินค้าที่ admin ปิดไว้
```

---

### POST /products (admin only)

```
LOGIC:
1. JwtAuthGuard อ่าน x-user headers → req.user
2. RolesGuard เช็ค role === 'admin'
   → ไม่ใช่ admin → 403 Forbidden
3. create(dto, req.user.id)
   → บันทึก createdBy = admin user id
```

---

### decreaseStock / increaseStock

```
decreaseStock(id, qty):
  product = findById(id)
  if stock < qty → BadRequestException('สินค้าไม่เพียงพอ')
  product.stock -= qty
  save()

increaseStock(id, qty):
  product.stock += qty
  save()
```

**ใช้ตอน:** add cart (ลด) / remove cart (คืน)

---

## 4. commerce-api: Cart

### getCart(userId)

```
LOGIC:
cart = findOne({ userId }).populate('items.productId')
if !cart → return { items: [] }  // ไม่ error — ตะกร้าว่างปกติ
return cart
```

---

### addItem(userId, productId, quantity)

```
LOGIC:
1. product = findById(productId)
2. if product.stock < quantity → BadRequestException
3. cart = findOne({ userId }) || new Cart({ userId, items: [] })
4. existingItem = cart.items.find(productId เดียวกัน)
   if existingItem:
     existingItem.quantity += quantity
   else:
     cart.items.push({ productId, quantity })
5. cart.save()
6. decreaseStock(productId, quantity)   ← สำคัญ: ลดทันที
7. return cart
```

**Logic ที่ต้องจำสัมภาษณ์:**
- เช็ค stock **ก่อน** เพิ่ม
- สินค้าซ้ำใน cart → **รวม quantity** ไม่สร้าง row ใหม่
- stock ลดตอน add ไม่ใช่ checkout

---

### removeItem(userId, productId)

```
LOGIC:
1. cart = findOne({ userId }) → ไม่มี → NotFoundException
2. removedItem = หา item ใน cart
   → ไม่มี → NotFoundException
3. filter ออกจาก items
4. cart.save()
5. increaseStock(productId, removedItem.quantity)  ← คืน stock
```

---

## 5. commerce-api: Orders

### checkout(userId)

```
LOGIC:
1. cart = getCart(userId)
2. if cart.items.length === 0 → BadRequestException('Cart is empty')
3. map items:
   { productId, quantity, price: product.price }  ← snapshot ราคา
4. totalPrice = sum(price * quantity)
5. new Order({ userId, items, totalPrice, status: 'pending' })
6. order.save()
7. return order
   // ยังไม่ล้าง cart — รอจ่ายสำเร็จก่อน (บน branch ที่มี notification)
```

**ทำไม snapshot price?** ราคาสินค้าอาจเปลี่ยนหลังสั่ง — order ต้องเก็บราคาตอนซื้อ

**ทำไม status pending?** ยังไม่จ่ายเงิน

---

### updateStatus (admin) — มีใน commerce-api แต่ยังไม่ต่อ Gateway/Frontend

```
LOGIC:
if status not in [pending, paid, shipped, delivered] → BadRequestException
order = findByIdAndUpdate(id, { status })
→ ไม่เจอ → NotFoundException
```

**สถานะจริงในโปรเจกต์:**
- `pending` → ตอน checkout (ทำงาน)
- `paid` → ตอน charge สำเร็จ (ทำงาน)
- `shipped` / `delivered` → มีใน enum + API admin แต่ **ยังไม่ได้ใช้ใน flow จริง**

---

## 6. commerce-api: Payments

### charge(orderId, token)

```
LOGIC:
1. order = findById(orderId)
   → ไม่เจอ → NotFoundException
2. if order.status !== 'pending'
   → BadRequestException('Order is not pending')
   // กัน double charge
3. charge = omise.charges.create({
     amount: totalPrice * 100,  // บาท → สตางค์
     currency: 'thb',
     card: token
   })
4. if charge.status === 'successful':
     order.status = 'paid'
     order.save()
     clearCart(userId)                    // ล้างตะกร้าหลังจ่าย
     sendPaymentSuccess(userId, orderId)  // notification
5. return { chargeId, status }
```

**Logic สำคัญ:**
- จ่ายได้เฉพาะ order `pending`
- amount × 100 เพราะ Omise ใช้สตางค์
- สำเร็จแล้วถึงล้าง cart + แจ้งเตือน

---

### sendPaymentSuccess (service-to-service)

```
LOGIC:
1. sign JWT { sub: 'commerce-api', role: 'admin' }
2. POST notification-service /notifications
   body: { userId, title, message, type: 'payment_success', metadata }
3. if response ไม่ ok → log warn (ไม่ throw — จ่ายสำเร็จแล้ว ไม่ให้ payment fail เพราะ notification พัง)
```

**ทำไมไม่ throw ถ้า notification fail?** payment สำเร็จแล้ว — notification เป็น side effect

---

## 7. notification-service Logic

### create (admin only)

```
LOGIC:
1. JwtAuthGuard verify Bearer token
2. RolesGuard เช็ค role === 'admin'
3. save notification document
```

commerce-api ใช้ admin JWT → ผ่านได้

---

### getMyNotifications(userId)

```
LOGIC:
filter = { userId }
if type query → filter.type = type
paginate: skip, limit, sort createdAt desc
return { data, meta: { total, page, limit, totalPages } }
```

**Security:** filter ด้วย userId จาก JWT — user อ่านได้แค่ของตัวเอง

---

### markAsRead(id, userId)

```
LOGIC:
findOneAndUpdate({ _id: id, userId }, { isRead: true })
→ ไม่เจอ → NotFoundException
// กัน user อ่าน notification ของคนอื่น
```

---

## 8. Frontend Logic

### initAuth (เปิดเว็บ)

```
LOGIC:
access = localStorage.access_token
refresh = localStorage.refresh_token

if !access || !refresh:
  clearAuth()  // ไม่ redirect
  authReady = true
  return

if isTokenExpired(access):
  newToken = handleRefresh()
  if !newToken: clearAuth()
else:
  setAccessToken(access)

authReady = true
```

---

### axios interceptor (401)

```
LOGIC:
if status !== 401 → reject ตามปกติ

if already retried || no refreshHandler:
  forceLogout()
  return

if isRefreshing:
  queue request รอ token ใหม่
else:
  isRefreshing = true
  newToken = await refreshHandler()
  if success:
    retry original request
  else:
    forceLogout()
  isRefreshing = false
```

**ทำไมมี queue?** กันหลาย API ยิงพร้อมกันตอน token หมดอายุ — refresh แค่ครั้งเดียว

---

### getUserRole (ProductsPage)

```
LOGIC:
decode JWT payload (atob middle part)
return payload.role ?? 'user'
→ admin เห็นปุ่มเพิ่ม/ลบสินค้า
```

**หมายเหตุ:** เป็น UI hint เท่านั้น — security จริงอยู่ที่ backend RolesGuard

---

## 9. Logic Map ภาพรวม

```
┌─────────────┐     verify JWT      ┌──────────────┐
│   Gateway   │ ──────────────────► │ Auth-Service │
└──────┬──────┘                     └──────────────┘
       │ x-user headers
       ▼
┌─────────────┐   stock↓ on add    ┌──────────────┐
│ commerce-api│ ─────────────────► │   MongoDB    │
└──────┬──────┘                    └──────────────┘
       │ admin JWT POST
       ▼
┌─────────────┐
│ notification│
└─────────────┘

Status flow:
  cart items ──checkout──► order(pending) ──charge OK──► order(paid)
                              │                              │
                              │                              └── clear cart
                              │                              └── notification
```

---

## 10. คำถามสัมภาษณ์เรื่อง Logic

**Q: order status มีอะไรบ้าง ทำครบทุกอันไหม?**

> Schema มี pending, paid, shipped, delivered
> Flow ที่ทำงานจริงตอนนี้แค่ pending → paid
> shipped/delivered เตรียมไว้ใน schema และมี admin endpoint ใน commerce-api แต่ยังไม่ต่อ Gateway และไม่มี UI

---

**Q: ถ้า add cart แล้วไม่ checkout จะเกิดอะไร?**

> stock ถูกลดไปแล้วตอน add — ถ้าไม่ checkout stock ค้างลด ถ้าลบออกจาก cart stock คืน ถ้า checkout แล้วไม่จ่าย order ค้าง pending stock ไม่คืน (ต้องมี logic เพิ่มถ้าอยาก cancel order)

---

**Q: จ่ายซ้ำ order เดิมได้ไหม?**

> ไม่ได้ — charge เช็ค `status !== pending` แล้ว reject

---

**Q: ถ้า notification service ล่ม จ่ายเงินสำเร็จไหม?**

> สำเร็จ — payment logic ไม่ fail เพราะ notification; แค่ log error

---

**Q: user ธรรมดาเรียก POST /notifications ได้ไหม?**

> ไม่ได้ — ต้อง role admin; user ใช้ได้แค่ GET/PATCH/DELETE ของตัวเอง

---

**Q: ทำไม Gateway ส่ง header แต่ notification ส่ง JWT?**

> commerce ออกแบบให้เชื่อ Gateway (internal trust boundary)
> notification ออกแบบให้ verify JWT เอง (รับทั้ง user token และ admin service token)

---

*คู่กับ INTERVIEW-QA-FRUIT-SHOP.md | อัปเดต กรกฎาคม 2026*
