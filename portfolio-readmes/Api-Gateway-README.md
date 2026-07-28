# 🔀 API Gateway — คู่มืออ่านเอง

## Gateway คืออะไร?

**ประตูทางเข้าเดียว** ระหว่าง Frontend กับ backend หลายตัว

Frontend ไม่ต้องรู้ว่า Auth อยู่พอร์ตไหน Commerce อยู่พอร์ตไหน — รู้แค่ URL ของ Gateway

---

## ทำอะไรบ้าง?

1. รับ request จาก Frontend (Vercel / localhost)
2. route ไป service ที่ถูก (`/auth/*` → Auth, `/products` → Commerce)
3. ถ้า route ต้อง login → `GatewayAuthGuard` verify JWT
4. ส่งต่อไป Commerce พร้อม headers:
   - `x-user-id`, `x-user-email`, `x-user-role`
   - `x-gateway-secret` (คู่กับ Commerce `.env`)

---

## แผนภาพ

```
Frontend
   │
   ▼
Gateway :3004
   ├── /auth/login      → Auth-Service
   ├── /products        → Commerce-API
   ├── /cart/*          → Commerce-API
   ├── /orders/*        → Commerce-API
   ├── /payments/charge → Commerce-API
   └── /notifications/* → Notification-Service
```

**ไม่มี** `/api` นำหน้า — `setGlobalPrefix('api')` ถูก comment ไว้

---

## วิธีรัน

```bash
git clone https://github.com/panapolll/Api-Gateway.git
cd Api-Gateway
yarn install
cp .env.example .env
yarn start:dev
```

Branch หลัก: **`master`** (ไม่ใช่ `main`)

---

## Environment

| ตัวแปร | ตัวอย่าง | หมายเหตุ |
|--------|----------|----------|
| `PORT` | `3004` | |
| `AUTH_SERVICE_URL` | `http://localhost:3100` | |
| `COMMERCE_API_URL` | `http://localhost:3000` | |
| `NOTIFICATION_SERVICE_URL` | `http://localhost:3001` | |
| `JWT_SECRET` | ตรงกับ Auth | ใช้ verify token |
| `GATEWAY_SECRET` | สตริงลับเดียวกับ Commerce | ส่งใน `x-gateway-secret` |

---

## CORS

อนุญาต:

- `http://localhost:5173`
- `https://fruit-shop-frontend-six.vercel.app`

`credentials: true` สำหรับ cookie/credentials ถ้าใช้ในอนาคต

---

## ไฟล์สำคัญ

| ไฟล์ | ทำอะไร |
|------|--------|
| `commerce-proxy.service.ts` | ส่ง request ไป Commerce + `buildHeaders()` |
| `auth-proxy/*` | login register refresh |
| `gateway-auth.guard.ts` | ดึง JWT จาก Authorization header |

---

## Push จำไว้

```bash
git push origin master
```
