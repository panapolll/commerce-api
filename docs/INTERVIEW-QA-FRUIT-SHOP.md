# Fruit Shop Microservices — คำถามสัมภาษณ์พร้อมคำตอบ

> โปรเจกต์: Fruit Shop | Stack: NestJS, React, MongoDB, Omise, JWT  
> Demo: https://fruit-shop-frontend-six.vercel.app  
> GitHub: https://github.com/panapolll

---

## สารบัญ

1. [เปิดตัว 30 วินาที](#1-เปิดตัว-30-วินาที)
2. [ภาพรวม Architecture](#2-ภาพรวม-architecture)
3. [Flow 1: Login](#3-flow-1-login)
4. [Flow 2: ซื้อของ + ชำระเงิน](#4-flow-2-ซื้อของ--ชำระเงิน)
5. [Flow 3: Notification](#5-flow-3-notification)
6. [คำถาม JWT / Auth](#6-คำถาม-jwt--auth)
7. [คำถาม Api-Gateway](#7-คำถาม-api-gateway)
8. [คำถาม commerce-api](#8-คำถาม-commerce-api)
9. [คำถาม Frontend](#9-คำถาม-frontend)
10. [Monolith vs Microservices](#10-monolith-vs-microservices)
11. [คำถาม Career Changer](#11-คำถาม-career-changer)
12. [คำถาม AI / การเรียนรู้](#12-คำถาม-ai--การเรียนรู้)
13. [Self-check Quiz](#13-self-check-quiz)
14. [Checklist ก่อนสัมภาษณ์](#14-checklist-ก่อนสัมภาษณ์)

---

## 1. เปิดตัว 30 วินาที

**คำถาม:** แนะนำตัวและโปรเจกต์สั้นๆ

**คำตอบ:**

> สวัสดีครับ ผมปนพล สุขเจริญ จบนิเทศศาสตร์ สาขาวิทยุและโทรทัศน์ ม.เกษมบัณฑิต ตอนนี้มุ่งสู่ Junior Full Stack Developer โดยเน้น Backend  
>  
> โปรเจกต์หลักคือ Fruit Shop Microservices ใช้ NestJS, React, MongoDB และ Omise แยก service เป็น Auth, Commerce, Notification ผ่าน Api-Gateway ครบ flow ตั้งแต่ login, ตะกร้า, checkout, ชำระเงิน และแจ้งเตือนหลังจ่ายสำเร็จ  
>  
> Demo: fruit-shop-frontend-six.vercel.app | GitHub: github.com/panapolll

---

## 2. ภาพรวม Architecture

**คำถาม:** โปรเจกต์มีกี่ service แต่ละตัวทำอะไร port เท่าไหร่?

**คำตอบ:**

| Repo | Port | หน้าที่ |
|------|------|--------|
| fruit-shop-frontend | 5173 | UI ทั้งหมด (React + Vite) |
| Api-Gateway | 3004 | ประตูเดียว, verify token, proxy |
| Auth-Service | 3100 | Login, Register, Refresh, Verify |
| commerce-api | 3000 | สินค้า, ตะกร้า, ออเดอร์, Omise |
| notification-service | 3001 | แจ้งเตือนในระบบ |

```
Frontend → Api-Gateway → Auth / Commerce / Notification
Commerce → Notification (ตรง, ไม่ผ่าน Gateway)
```

---

**คำถาม:** ทำไมต้องแยก microservices ไม่ทำ monolith เลย?

**คำตอบ:**

- แยก **responsibility** — Auth ดูแล identity, Commerce ดูแลธุรกิจ, Notification ดูแลแจ้งเตือน
- **Deploy แยก** — แก้ notification ไม่ต้อง redeploy ทั้งระบบ
- **Scale แยก** — ถ้า traffic หนักที่ commerce ก็ scale แค่ตัวนั้น
- **ข้อเสีย:** debug ยากกว่า เพราะต้อง trace ข้าม service

---

## 3. Flow 1: Login

**คำถาม:** อธิบาย login flow ตั้งแต่กดปุ่มจนได้ token

**คำตอบ:**

1. User กรอก email/password กด Login
2. Frontend `POST /auth/login` → Api-Gateway (:3004)
3. Gateway forward → Auth-Service (:3100)
4. Auth หา user ใน MongoDB → `bcrypt.compare` รหัสผ่าน
5. ถูก → สร้าง `access_token` (15 นาที) + `refresh_token` (1 ชม.)
6. hash refresh token เก็บใน DB
7. return tokens → Frontend เก็บ `localStorage`
8. `setAccessToken()` ใน axios → request ถัดไปแนบ `Authorization: Bearer <token>`

---

**คำถาม:** access_token กับ refresh_token ต่างกันยังไง?

**คำตอบ:**

| | access_token | refresh_token |
|--|--------------|---------------|
| อายุ | 15 นาที | 1 ชั่วโมง |
| Secret | `JWT_SECRET` | `REFRESH_TOKEN_SECRET` |
| เก็บที่ไหน | localStorage | localStorage + DB (hash) |
| ใช้ทำอะไร | แนบทุก API call | ขอ token ใหม่เมื่อ access หมดอายุ |

---

**คำถาม:** token หมดอายุระหว่างใช้งาน frontend ทำยังไง?

**คำตอบ:**

มี 3 ชั้น:

1. **เปิดเว็บ** — `initAuth()` เช็ค access หมดอายุไหม → เรียก refresh
2. **ทุก 30 วินาที** — interval เช็ค + refresh ก่อนหมด
3. **axios interceptor** — ได้ 401 → เรียก `POST /auth/refresh` → retry request; refresh ล้มเหลว → logout

---

**คำถาม:** ทำไม hash refresh token ก่อนเก็บ DB?

**คำตอบ:**

ถ้า DB รั่ว คนร้ายเอา refresh token จาก DB ไปใช้ต่อไม่ได้ — เหมือนเก็บ password เป็น hash ไม่ใช่ plain text

---

**คำถาม:** Gateway ทำอะไรตอน login?

**คำตอบ:**

แค่ **forward** request ไป Auth-Service — route login เป็น public ไม่ต้อง verify token

---

## 4. Flow 2: ซื้อของ + ชำระเงิน

**คำถาม:** อธิบาย flow ตั้งแต่ add to cart จนจ่ายเงินสำเร็จ

**คำตอบ:**

**Add to Cart:**
1. `POST /cart/items` + Bearer token
2. Gateway verify token → ส่งต่อ commerce-api พร้อม `x-user-id`, `x-user-email`, `x-user-role`
3. commerce เช็ค stock → เพิ่มใน cart → **decreaseStock ทันที**

**Checkout:**
4. `POST /orders/checkout`
5. อ่าน cart → สร้าง Order สถานะ `pending` (snapshot ราคา)

**Payment:**
6. หน้า Payment — Omise.js สร้าง card token ฝั่ง browser
7. `POST /payments/charge` { orderId, token }
8. commerce เรียก Omise API charge
9. สำเร็จ → `order.status = paid` → clear cart → ส่ง notification

---

**คำถาม:** stock ลดเมื่อไหร่?

**คำตอบ:**

**ตอน add to cart** ไม่ใช่ตอน checkout

ลบออกจากตะกร้า → `increaseStock` คืน stock

---

**คำถาม:** ทำไม commerce-api ไม่ verify JWT เอง?

**คำตอบ:**

Gateway verify แล้วส่ง header มาแทน:

- `x-user-id`
- `x-user-email`
- `x-user-role`

commerce อ่าน header แล้วใส่ `req.user` — **เชื่อ Gateway ว่า verify แล้ว**

---

**คำถาม:** บัตรเครดิตผ่าน server เราไหม?

**คำตอบ:**

**ไม่** — เลขบัตรอยู่แค่ใน browser

Omise.js สร้าง **card token** ฝั่ง client แล้วส่งแค่ token ไป `POST /payments/charge`

---

**คำถาม:** ทำไมเก็บ price ใน order items (snapshot)?

**คำตอบ:**

ราคาสินค้าอาจเปลี่ยนหลัง user สั่ง — snapshot ราคาตอนสั่งให้ order สะท้อนยอดจริงตอนซื้อ

---

**คำถาม:** order มี status อะไรบ้าง?

**คำตอบ (ตรงกับโปรเจกต์จริง):**

**ที่ implement แล้วใน flow หลัก:**
- `pending` — สร้างตอน checkout
- `paid` — หลัง Omise charge สำเร็จ

**ที่มีใน schema แต่ยังไม่ได้ทำครบ flow:**
- `shipped`, `delivered` — กำหนดใน enum + มี `PATCH /orders/:id/status` ใน commerce-api (admin) แต่ **ยังไม่ expose ผ่าน Gateway, ไม่มี UI admin, ไม่มี notification ตอนเปลี่ยนสถานะ**

> **พูดในสัมภาษณ์:** "ตอนนี้ flow ที่ทำงานจริงคือ pending → paid ส่วน shipped/delivered ออกแบบไว้ใน schema เป็น roadmap ถ้ามีเวลาจะเพิ่ม admin panel กับ notification order_shipped ต่อครับ"

---

## 5. Flow 3: Notification

**คำถาม:** หลังจ่ายเงินสำเร็จ notification เกิดยังไง?

**คำตอบ:**

1. commerce-api charge สำเร็จ
2. `NotificationsService.sendPaymentSuccess()`
3. sign JWT ชั่วคราว `role: admin` (ใช้ `JWT_SECRET`)
4. `POST` ตรงไป notification-service `:3001/notifications`
5. บันทึก `{ userId, title, message, type: payment_success }`
6. User เปิดเว็บ → `GET /notifications/unread-count` ผ่าน Gateway → เห็น badge 🔔

---

**คำถาม:** ทำไม commerce เรียก notification ไม่ผ่าน Gateway?

**คำตอบ:**

เป็น **service-to-service call** — ไม่มี browser/user อยู่ตรงกลาง

commerce เรียกตรงด้วย admin service token

ส่วน **user ดูแจ้งเตือน** ยังผ่าน Gateway ด้วย Bearer token ปกติ

---

**คำถาม:** JWT_SECRET ต้องตรงกันที่ service ไหนบ้าง?

**คำตอบ:**

- Auth-Service (sign/verify access)
- commerce-api (sign admin token ส่ง notification)
- notification-service (verify JWT)

**Api-Gateway ไม่ต้องมี** — ส่ง token ไปให้ Auth verify แทน

---

## 6. คำถาม JWT / Auth

**คำถาม:** JWT payload มีอะไรบ้าง?

**คำตอบ:**

```json
{
  "sub": "<userId>",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234568790
}
```

`sub` = user id | `exp` = หมดอายุ

---

**คำถาม:** `@Public()` ใน Auth-Service ทำงานยังไง?

**คำตอบ:**

Controller ติด `@UseGuards(JwtAuthGuard)` ทั้ง class

route login/register/refresh/verify ติด `@Public()` → Guard อ่าน metadata แล้ว**ข้าม**การเช็ค JWT

---

**คำถาม:** logout ทำอะไร?

**คำตอบ:**

ตั้ง `refreshToken = null` ใน DB

access token ยังใช้ได้จนกว่าจะหมดอายุ (15 นาที) แต่ refresh ต่อไม่ได้

---

## 7. คำถาม Api-Gateway

**คำถาม:** ทำไมต้องมี Api-Gateway?

**คำตอบ:**

- Frontend เรียกที่เดียว ไม่ต้องรู้ port ทุก service
- รวม auth check ที่จุดเดียว (`GatewayAuthGuard` → `POST /auth/verify`)
- แยก concern: Gateway = routing, Auth = identity

---

**คำถาม:** GatewayAuthGuard ทำงานยังไง?

**คำตอบ:**

1. ดึง `Authorization: Bearer <token>`
2. `POST /auth/verify` ที่ Auth-Service
3. `valid: true` → ใส่ `req.user = { userId, email, role }`
4. ส่งต่อ commerce ด้วย `x-user-*` headers

---

**คำถาม:** ทำไม cart/orders/payments แยก module แต่ใช้ CommerceProxyService ร่วม?

**คำตอบ:**

ทั้ง 3 อยู่ที่ **commerce-api เครื่องเดียวกัน**

แยก module เพื่อ route ชัด (`/cart`, `/orders`, `/payments`) แต่ proxy logic เหมือนกัน

---

## 8. คำถาม commerce-api

**คำถาม:** MongoDB collection มีอะไรบ้าง?

**คำตอบ:**

- `products` — สินค้า (name, price, stock, isActive)
- `carts` — ตะกร้า (userId, items[])
- `orders` — ออเดอร์ (userId, items[], totalPrice, status)

(Auth มี `users` แยกใน Auth-Service)

---

**คำถาม:** Omise charge amount คำนวณยังไง?

**คำตอบ:**

`amount: order.totalPrice * 100` — Omise ใช้หน่วย**สตางค์** (บาท × 100)

---

## 9. คำถาม Frontend

**คำถาม:** `VITE_API_URL` คืออะไร ทำไม production login พังได้?

**คำตอบ:**

URL ของ Api-Gateway

ถ้า Vercel ไม่ตั้ง env → fallback `http://localhost:3004` → production เรียก localhost ไม่ได้

**แก้:** deploy backend + ตั้ง `VITE_API_URL` ใน Vercel + redeploy

---

**คำถาม:** ทำไมมี `clearAuth` กับ `handleLogout` แยกกัน?

**คำตอบ:**

- `clearAuth` — ล้าง token อย่างเดียว ไม่ redirect (ใช้ตอน init ไม่มี token)
- `handleLogout` — ล้าง + redirect ไป `/login` (ยกเว้นอยู่หน้า login/register แล้ว)

ป้องกัน redirect loop

---

## 10. Monolith vs Microservices

**คำถาม:** โปรเจกต์คุณต่างจาก monolith ยังไง?

**คำตอบ:**

| Monolith | Microservices (โปรเจกต์คุณ) |
|----------|----------------------------|
| ทุกอย่างใน repo เดียว | แยก 5 repo |
| auth + commerce ร่วม DB ได้ | Auth มี users, Commerce มี products/orders |
| scale ทั้งก้อน | scale แต่ละ service |
| debug ง่ายกว่า | ต้อง trace ข้าม service |

---

## 11. คำถาม Career Changer

**คำถาม:** ทำไมเปลี่ยนสายจากนิเทศศาสตร์?

**คำตอบ:**

> ชอบสร้างระบบที่ใช้งานได้จริง ไม่ใช่แค่เนื้อหา  
> เรียน NestJS/React เอง ทำโปรเจกต์ microservices ครบ flow  
> ทักษะสื่อสารจากนิเทศศาสตร์ช่วยตอนทำงานกับทีมและอธิบาย technical ได้

---

**คำถาม:** จุดอ่อนคืออะไร?

**คำตอบ:**

> เขียน syntax จากศูนย์ยังไม่คล่อง แต่อ่านโค้ด trace flow และแก้ bug ได้  
> กำลังฝึกพิมพ์เองมากขึ้นจากการแก้โค้ดเล็กๆ ในโปรเจกต์

---

**คำถาม:** ทำไมสมัคร Junior Backend / Full Stack?

**คำตอบ:**

> มี foundation จากโปรเจกต์จริง ครบ auth, API, DB, payment  
> พร้อมเรียนรู้จาก senior ใน codebase จริง  
> ไม่ claim ว่า expert แต่เข้าใจ architecture และ debug ได้

---

## 12. คำถาม AI / การเรียนรู้

**คำถาม:** ใช้ AI ช่วยไหม?

**คำตอบ:**

> ใช้ช่วย debug, อ่าน docs, และเร่งการเรียนรู้  
> แต่เข้าใจ flow และอธิบาย architecture ได้เอง  
> ไม่ใส่ใน resume แต่พูดตรงๆ ถ้าถามในสัมภาษณ์

---

## 13. Self-check Quiz

ตอบในใจก่อน แล้วเปิดดูเฉลย

1. Login ยิง endpoint อะไร port ไหน?
2. access token อายุเท่าไหร่?
3. stock ลดตอนไหน?
4. order สถานะแรกคืออะไร?
5. บัตรเครดิตผ่าน server เราไหม?
6. notification หลังจ่ายเงินผ่าน Gateway ไหม?
7. user ดูแจ้งเตือนผ่านอะไร?
8. Gateway มี JWT_SECRET ไหม?
9. REFRESH_TOKEN_SECRET ใช้กับ token ไหน?
10. commerce verify JWT เองไหม?

<details>
<summary>เฉลย</summary>

1. `POST /auth/login` → Gateway `:3004`
2. 15 นาที
3. ตอน add to cart
4. `pending`
5. ไม่ — ส่งแค่ Omise token
6. ไม่ — commerce ส่งตรงไป notification-service
7. Gateway → notification-service (user JWT)
8. ไม่มี
9. refresh_token
10. ไม่ — อ่าน x-user headers จาก Gateway

</details>

---

## 14. Checklist ก่อนสัมภาษณ์

- [ ] อธิบาย 3 flow ปากเปล่าได้ (Login, ซื้อ+จ่าย, Notification)
- [ ] รู้ port ทุก service (5173, 3004, 3100, 3000, 3001)
- [ ] รู้ access vs refresh token
- [ ] รู้ทำไม Gateway ไม่มี JWT_SECRET
- [ ] รู้ stock ลดตอน add cart
- [ ] มี resume PDF พร้อม
- [ ] เปิด GitHub + demo link
- [ ] เตรียมถามกลับ 1–2 ข้อ

---

## แผนฝึก 5 วัน

| วัน | โฟกัส | เวลา |
|-----|-------|------|
| 1 | อ่าน Flow 1–3 ออกเสียง | 45 นาที |
| 2 | ตอบคำถามข้อ 3–6 (JWT, Gateway) | 30 นาที |
| 3 | Pitch 30 วินาที + career changer | 30 นาที |
| 4 | Self-check quiz 10 ข้อ | 20 นาที |
| 5 | Mock interview 15 นาที | 15 นาที |

---

*อัปเดต: กรกฎาคม 2026 | โปรเจกต์ Fruit Shop — panapolll*
