# Commerce API — คู่มือสั้น (อ่านเอง)

ดู README หลักใน root repo ด้วย — ไฟล์นี้สรุปซ้ำแบบจำง่าย

## จำสามคำ

**สินค้า → ตะกร้า → ออเดอร์ → จ่ายเงิน → แจ้งเตือน**

## Port

`3000`

## คำสั่ง

```bash
yarn install
cp .env.example .env
yarn seed
yarn start:dev
```

## Guard สำคัญ

- `JwtAuthGuard` — รับ user จาก Gateway headers + เช็ค `GATEWAY_SECRET`
- `RolesGuard` — admin เท่านั้นสำหรับ CRUD สินค้า

## อย่าเปิด endpoint แบบนี้อีก

- `POST /users/:createUsers` ไม่มี guard → ลบแล้ว
- สมัคร user ผ่าน Auth-Service เท่านั้น
