# 🍎 Commerce API — ร้านผลไม้ (Fruit Shop)

> **Repo นี้ทำอะไร?**  
> เป็นส่วน **หลังบ้านร้านค้า** — จัดการสินค้า ตะกร้า ออเดอร์ และรับเงินผ่าน Omise  
> **ไม่ใช่** ตัว login หลัก (login อยู่ที่ Auth-Service ผ่าน Gateway)

**Demo Frontend:** https://fruit-shop-frontend-six.vercel.app

---

## ภาพรวมระบบทั้งหมด (จำแบบนี้)

```
[ React Frontend ]  ← ผู้ใช้กดปุ่มที่นี่ (Vercel)
        │
        ▼
[ API Gateway :3004 ]  ← ประตูทางเข้าเดียว / ตรวจ JWT
        │
        ├── Auth-Service (:3100)     → สมัคร / login / refresh token
        ├── Commerce-API (:3000)     → สินค้า ตะกร้า ออเดอร์ จ่ายเงิน  ← repo นี้
        └── Notification (:3001)     → แจ้งเตือนหลังจ่ายเงิน
```

**ทำไมไม่ให้ Frontend ยิงตรง Commerce?**

- ซ่อน URL จริงของแต่ละ service
- ตรวจ JWT ที่ Gateway จุดเดียว
- Commerce รู้ว่า request มาจาก Gateway จริง (ผ่าน `GATEWAY_SECRET`)

---

## ใน repo นี้มีอะไรบ้าง

| โฟลเดอร์ | ทำอะไร |
|----------|--------|
| `src/products` | CRUD สินค้า (admin เท่านั้นที่สร้าง/แก้/ลบ) |
| `src/cart` | ตะกร้า — เพิ่ม/ลบสินค้า, stock ลดตอนใส่ตะกร้า |
| `src/orders` | checkout สร้างออเดอร์ `pending` |
| `src/payments` | จ่ายผ่าน Omise + webhook สำรอง |
| `src/notfications` | เรียก Notification Service หลังจ่ายสำเร็จ |
| `src/auth` + `src/users` | guard รับ user จาก Gateway headers (ไม่ใช่ login หลัก) |
| `src/seed.ts` | ใส่ admin + สินค้าตัวอย่างใน DB |

---

## Flow ที่ควรเข้าใจ (สำหรับสัมภาษณ์)

### 1) Login (ไม่ได้เกิดใน repo นี้โดยตรง)

```
Frontend → Gateway → Auth-Service
→ ได้ access_token + refresh_token
→ Frontend เก็บใน localStorage
```

### 2) ซื้อของ

```
GET /products        → ดูสินค้า (ไม่ต้อง login)
POST /cart/add       → ใส่ตะกร้า (ต้อง login) + stock ลด
POST /orders/checkout → สร้าง order status: pending
```

ถ้ามี pending order อยู่แล้ว → **ไม่สร้างซ้ำ** (คืนอันเดิม)

### 3) จ่ายเงิน

```
Frontend สร้าง Omise token จากบัตร (vault.omise.co)
→ POST /payments/charge { orderId, token }
→ Commerce เช็คว่า order เป็นของ user นี้จริง (กัน IDOR)
→ Omise ตัดเงิน → order = paid → ล้างตะกร้า
→ ส่ง notification ไป Notification Service
```

### 4) รู้ว่าใครเรียก API (Guards)

```
JwtAuthGuard
  1. เช็ค x-gateway-secret (ถ้ามี GATEWAY_SECRET ใน .env)
  2. อ่าน x-user-id, x-user-email, x-user-role จาก Gateway
  3. ใส่ req.user ให้ controller ใช้

RolesGuard + @Roles('admin')
  → เช็ค role จาก req.user
```

- **401** = ยังไม่ login / token หมด / secret ผิด  
- **403** = login แล้วแต่ role ไม่พอ (เช่น user อยากลบสินค้า)

---

## วิธีรันบนเครื่อง

### ต้องมีก่อน

- Node.js 20+
- MongoDB (Atlas หรือ local)
- Omise test keys
- **Gateway + Auth รันด้วย** ถ้าจะทดสอบผ่าน Frontend จริงๆ

### ขั้นตอน

```bash
git clone https://github.com/panapolll/commerce-api.git
cd commerce-api
yarn install
cp .env.example .env   # แก้ค่าให้ครบ
yarn seed              # สร้าง admin + สินค้า (ต้องมี SEED_ADMIN_* ใน .env)
yarn start:dev         # รันที่พอร์ต 3000
```

---

## ตัวแปรใน `.env` (อธิบายทีละตัว)

| ตัวแปร | ทำไมต้องมี |
|--------|------------|
| `MONGO_URI` | เชื่อม MongoDB เก็บสินค้า ตะกร้า ออเดอร์ |
| `JWT_SECRET` | ใช้ sign token ตอน commerce เรียก notification (ต้องตรงกับ Auth) |
| `GATEWAY_SECRET` | คู่กับ Gateway — กันยิง commerce ตรงโดยไม่ผ่าน Gateway |
| `OMISE_PUBLIC_KEY` / `OMISE_SECRET_KEY` | รับเงิน test mode |
| `NOTIFICATION_SERVICE_URL` | URL ของ notification service (เช่น `http://localhost:3001`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | ใช้ตอน `yarn seed` เท่านั้น |

---

## API สำคัญ (ผ่าน Gateway ไม่มี prefix `/api`)

| Method | Path | ใครใช้ได้ |
|--------|------|-----------|
| GET | `/products` | ทุกคน |
| POST | `/products` | admin |
| GET | `/cart` | login |
| POST | `/cart/add` | login |
| POST | `/orders/checkout` | login |
| GET | `/orders/me` | login |
| POST | `/payments/charge` | login (เจ้าของ order) |

---

## Repo ที่เกี่ยวข้อง

| Service | GitHub |
|---------|--------|
| Frontend | [fruit-shop-frontend](https://github.com/panapolll/fruit-shop-frontend) |
| API Gateway | [Api-Gateway](https://github.com/panapolll/Api-Gateway) |
| Auth Service | [Auth-Service](https://github.com/panapolll/Auth-Service) |
| Notification | [notification-service](https://github.com/panapolll/notification-service) |

README ภาษาไทยทุก service อยู่ในโฟลเดอร์ `portfolio-readmes/`

---

## สิ่งที่แก้/เรียนรู้จากโปรเจกต์นี้

- แยก microservice ตามหน้าที่ (auth ≠ commerce)
- ปิด endpoint เปิดโล่ง (`POST /users/:createUsers`)
- กัน IDOR ตอนจ่ายเงิน (เช็คเจ้าของ order)
- `GATEWAY_SECRET` คู่กัน Gateway ↔ Commerce
- Omise: token ที่ frontend, charge ที่ backend
- Notification ไม่ให้พัง flow จ่ายเงิน (try/catch + log)

---

## ผู้พัฒนา

Portfolio project — Panapol Sukcharoen (career changer → full-stack / backend)
