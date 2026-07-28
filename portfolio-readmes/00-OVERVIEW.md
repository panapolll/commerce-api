# 🍎 Fruit Shop — ภาพรวมทั้งโปรเจกต์

เอกสารนี้เขียนให้ **ตัวเราเองอ่านทบทวน** ก่อนสัมภาษณ์  
ไม่ต้องจำทุกบรรทัด — จำ **flow** กับ **ทำไมแยก service** พอ

---

## ระบบทำอะไร?

เว็บขายผลไม้: สมัครสมาชิก → ดูสินค้า → ใส่ตะกร้า → checkout → จ่ายบัตร → ได้แจ้งเตือน

---

## แผนภาพ (วาดในใจแบบนี้)

```
                    ┌─────────────────┐
                    │  React Frontend │
                    │  (Vercel)       │
                    └────────┬────────┘
                             │ VITE_API_URL
                             ▼
                    ┌─────────────────┐
                    │  API Gateway    │
                    │  :3004          │
                    │  ตรวจ JWT       │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
   │ Auth-Service │  │ Commerce-API │  │ Notification     │
   │ :3100        │  │ :3000        │  │ :3001            │
   │ login/register│  │ สินค้า จ่ายเงิน│  │ แจ้งเตือน        │
   └──────┬───────┘  └──────┬───────┘  └──────────────────┘
          │                 │
          └────────┬────────┘
                   ▼
            ┌─────────────┐
            │  MongoDB    │
            └─────────────┘
```

---

## แต่ละ repo หน้าที่อะไร (หนึ่งประโยค)

| Repo | หน้าที่สั้นๆ |
|------|----------------|
| **frontend** | หน้าจอให้ user กด — เรียก API แค่ Gateway |
| **Api-Gateway** | ประตูเดียว + แปลง JWT เป็น headers ส่งต่อ |
| **Auth-Service** | สมัคร / login / refresh — ออก JWT |
| **commerce-api** | สินค้า ตะกร้า ออเดอร์ Omise |
| **notification-service** | เก็บและแสดงแจ้งเตือน |

---

## ลำดับรันบนเครื่อง (local)

1. MongoDB (Atlas หรือ local)
2. Auth-Service `:3100`
3. Commerce-API `:3000` (+ `yarn seed` ครั้งแรก)
4. Notification `:3001`
5. Api-Gateway `:3004`
6. Frontend `yarn dev` → `localhost:5173`

---

## Secret ที่ต้อง **ตรงกัน** ข้าม repo

| ตัวแปร | ใช้ที่ไหนบ้าง |
|--------|----------------|
| `JWT_SECRET` | Auth, Gateway (verify), Commerce (เรียก notification) |
| `GATEWAY_SECRET` | Gateway (ส่ง) + Commerce (รับ) |
| `VITE_OMISE_PUBLIC_KEY` | Frontend |
| `OMISE_SECRET_KEY` | Commerce (charge) — คู่กับ public key |

---

## คำถามสัมภาษณ์ที่เตรียมไว้

**Q: ทำไมใช้ microservices?**  
A: แยกหน้าที่ชัด — auth เปลี่ยนบ่อยไม่กระทบ commerce, deploy แยกได้, ฝึก pattern จริงใน portfolio

**Q: Gateway ทำอะไร?**  
A: Frontend เรียกที่เดียว, verify JWT, ส่ง `x-user-id/email/role` + `x-gateway-secret` ไป commerce

**Q: กันคนอื่นจ่ายออเดอร์เราได้ไหม?**  
A: `charge()` เช็ค `order.userId === req.user.id` → 403 ถ้าไม่ใช่เจ้าของ

**Q: 401 vs 403?**  
A: 401 ยังไม่ auth / token พัง — 403 auth แล้วแต่สิทธิ์ไม่พอ

---

## ลิงก์ README แต่ละตัว

- [Commerce API](./Commerce-API-README.md)
- [API Gateway](./Api-Gateway-README.md)
- [Auth Service](./Auth-Service-README.md)
- [Frontend](./Frontend-README.md)
- [Notification Service](./Notification-README.md)
