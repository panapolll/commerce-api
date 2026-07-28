# 🔔 Notification Service — คู่มืออ่านเอง

## หน้าที่

เก็บ **แจ้งเตือนในแอป** — เช่น "ชำระเงินสำเร็จ"

ไม่ส่ง email / SMS — แค่ in-app notification ที่ user เปิดดูใน Frontend

---

## ใครเรียกใช้?

| ใคร | เมื่อไหร่ |
|-----|-----------|
| **Commerce-API** | หลัง Omise charge สำเร็จ → `POST /notifications` (service-to-service) |
| **Frontend** | ผ่าน Gateway → `GET /notifications/me`, mark read, ลบ |

---

## Flow หลังจ่ายเงิน

```
Commerce charge() สำเร็จ
    → notificationsService.sendPaymentSuccess()
    → sign JWT ชั่วคราว role admin (service account)
    → POST notification-service/notifications
    → บันทึก MongoDB

User เปิดหน้า Notifications
    → Gateway → GET /notifications/me
    → เห็น "ชำระเงินสำเร็จ 💳"
```

ถ้า notification ล้ม → **จ่ายเงินยังสำเร็จ** (commerce ใช้ try/catch ไม่ให้พัง flow)

---

## วิธีรัน

```bash
git clone https://github.com/panapolll/notification-service.git
cd notification-service
yarn install
cp .env.example .env
yarn start:dev
```

Port: **3001**

---

## Environment

| ตัวแปร | หมายเหตุ |
|--------|----------|
| `MONGODB_URI` | เก็บ notifications |
| `JWT_SECRET` | ตรงกับ Auth — verify Bearer จาก user |
| `PORT` | 3001 |

Commerce ต้องมี `NOTIFICATION_SERVICE_URL` ชี้มาที่นี่

---

## API (ผ่าน Gateway)

| Method | Path | ใคร |
|--------|------|-----|
| GET | `/notifications/me` | user login |
| GET | `/notifications/unread-count` | user login |
| PATCH | `/notifications/mark-all-read` | user login |
| PATCH | `/notifications/:id/read` | user login |
| DELETE | `/notifications/:id` | user login |
| POST | `/notifications` | admin / service (commerce เรียก) |

---

## สัมภาษณ์

**Q: ทำไมแยก service?**  
A: แจ้งเตือนอาจขยายเป็น push/email ทีหลัง ไม่ต้องแก้ commerce  
**Q: ทำไม commerce sign JWT เอง?**  
A: POST สร้าง notification ต้อง admin — commerce เป็น trusted internal caller
