# 🖥️ Frontend — คู่มืออ่านเอง

React + Vite — หน้าที่ให้ user ใช้งานจริง

**Repo จริง:** `fruit-shop-frontend` หรือ `ReactSeries/frontend` (แล้วแต่เครื่อง)  
**Deploy:** Vercel → https://fruit-shop-frontend-six.vercel.app

---

## หลักการสำคัญ

Frontend เรียก API **แค่ Gateway** — ไม่ยิงตรง Commerce หรือ Auth

```typescript
// config.ts
export const GATEWAY_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3004";
```

Production บน Vercel ต้องตั้ง:

```
VITE_API_URL=https://your-gateway.onrender.com
VITE_OMISE_PUBLIC_KEY=pkey_test_xxxxx
```

**หลังเพิ่ม env ต้อง Redeploy** — แก้ในเครื่องอย่างเดียว Vercel ไม่เปลี่ยน

---

## หน้าหลัก

| Path | หน้า |
|------|------|
| `/login` | เข้าสู่ระบบ |
| `/register` | สมัคร (validate ภาษาไทย) |
| `/products` | ดูสินค้า |
| `/cart` | ตะกร้า |
| `/payment` | จ่าย Omise |
| `/orders` | ออเดอร์ของฉัน |
| `/notifications` | แจ้งเตือน |

---

## Omise (จ่ายเงิน)

1. `index.html` โหลด `https://cdn.omise.co/omise.js`
2. `PaymentPage` เรียก `Omise.createToken('card', {...})`
3. ได้ `token` ส่งไป `POST /payments/charge` ผ่าน Gateway

**บัตรทดสอบ:** `4242 4242 4242 4242`  
**ปี:** ต้อง 4 หลัก เช่น `2028` (ไม่ใช่ `28`)

Error `vault.omise.co/tokens 400` → มักเป็น public key ผิด หรือปีบัตรผิด

---

## Token เก็บที่ไหน

`localStorage` — access_token, refresh_token, userId

Axios interceptor ใน `client.ts` แนบ `Authorization: Bearer ...` และ refresh อัตโนมัติเมื่อ 401

---

## วิธีรัน

```bash
yarn install
yarn dev
```

เปิด http://localhost:5173

---

## Push ขึ้น Vercel

```bash
git add .
git commit -m "..."
git push origin main
```

รอ Vercel deploy → hard refresh (`Ctrl+Shift+R`)
