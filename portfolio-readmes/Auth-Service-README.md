# 🔐 Auth Service — คู่มืออ่านเอง

## หน้าที่

จัดการ **ตัวตนผู้ใช้** — สมัคร, login, refresh token, logout

**ไม่เก็บสินค้า ไม่เก็บตะกร้า** — แค่ user + password (hash) + refresh token ใน DB

---

## Flow login (จำแบบนี้)

```
1. User ส่ง email + password
2. bcrypt เทียบ password
3. ออก access_token (15 นาที) + refresh_token (1 ชม.)
4. เก็บ refresh_token (hash) ใน MongoDB
5. ส่ง tokens กลับ Frontend
```

Token หมดอายุ → เรียก `POST /auth/refresh` ด้วย `userId` + `refreshToken`

---

## ValidationPipe (ข้อ 10 ที่แก้)

`main.ts` เปิด `ValidationPipe` global แล้ว

`RefreshTokenDto` แก้จาก `@IsEmail()` ผิด field เป็น:

- `refreshToken` → `@IsString()` + `@IsNotEmpty()`
- `userId` → `@IsMongoId()`

---

## API

| Method | Path | หมายเหตุ |
|--------|------|----------|
| POST | `/auth/register` | สมัคร user |
| POST | `/auth/login` | ได้ tokens |
| POST | `/auth/refresh` | ต่ออายุ access |
| POST | `/auth/logout` | ต้อง Bearer token |
| POST | `/auth/verify` | Gateway ใช้ตรวจ token |

---

## วิธีรัน

```bash
git clone https://github.com/panapolll/Auth-Service.git
cd Auth-Service
yarn install
cp .env.example .env
yarn start:dev
```

Port: **3100**

---

## Environment

| ตัวแปร | หมายเหตุ |
|--------|----------|
| `MONGODB_URI` | MongoDB ของ Auth (แยกจาก Commerce ได้) |
| `JWT_SECRET` | **ต้องตรง** กับ Gateway |
| `REFRESH_TOKEN_SECRET` | sign refresh token |
| `PORT` | 3100 |

---

## Live

https://auth-service-7xty.onrender.com

---

## สัมภาษณ์

**Q: ทำไมไม่ให้ Commerce login เอง?**  
A: Single responsibility — Auth ดูแล identity อย่างเดียว เปลี่ยน policy login ไม่กระทบร้านค้า
