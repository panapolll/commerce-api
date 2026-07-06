# Backend Practice — ฝึก Syntax & พื้นฐาน

โปรเจกต์นี้แยกจาก Commerce API หลัก เน้นฝึก **syntax TypeScript** และ **พื้นฐาน backend** ทีละขั้น

## เริ่มต้น

```bash
cd backend-practice
yarn install
```

## โครงสร้าง

```
backend-practice/
├── src/
│   ├── lessons/          ← ฝึก syntax (รันได้เลย ไม่ต้องมี DB)
│   │   ├── 01-variables.ts
│   │   ├── 02-functions.ts
│   │   ├── 03-async-await.ts
│   │   ├── 04-array-methods.ts
│   │   └── 05-destructuring.ts
│   ├── api/              ← ฝึก REST API (Todo CRUD)
│   │   ├── types.ts
│   │   ├── store.ts
│   │   └── routes/todos.ts
│   ├── run-lessons.ts
│   └── server.ts
└── README.md
```

## ลำดับการฝึก

### ขั้นที่ 1 — Syntax (ไม่ต้องรัน server)

```bash
yarn lesson
```

อ่านโค้ดใน `src/lessons/` ทีละไฟล์ แล้วลองแก้/ทดลองเอง

| บท | หัวข้อ | สิ่งที่ฝึก |
|----|--------|-----------|
| 01 | Variables & Types | `const`, `let`, `interface`, `type` |
| 02 | Functions | arrow fn, default param, higher-order |
| 03 | Async/Await | `Promise`, `try/catch`, `Promise.all` |
| 04 | Array Methods | `map`, `filter`, `find`, `reduce` |
| 05 | Destructuring | spread, rest, รับ request body |

### ขั้นที่ 2 — REST API

```bash
yarn dev
```

ทดสอบด้วย curl หรือ Postman:

```bash
# สร้าง todo
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"เรียน async/await"}'

# ดูทั้งหมด
curl http://localhost:4000/todos

# ทำเสร็จ
curl -X PATCH http://localhost:4000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# ลบ
curl -X DELETE http://localhost:4000/todos/1
```

### ขั้นที่ 3 — ทำ TODO ในโค้ดเอง

ค้นหา `// TODO ฝึกทำ` ในโปรเจกต์ แล้วลองเขียนเองก่อนดูเฉลย:

1. `src/lessons/02-functions.ts` → `calculateTotal`
2. `src/lessons/03-async-await.ts` → `fetchWithRetry`
3. `src/api/store.ts` → `findByStatus`
4. `src/api/routes/todos.ts` → `GET /todos/status/:status`

> เฉลยมีอยู่แล้วในโค้ด (comment ไว้) — ลองเขียนเองก่อน แล้วค่อย uncomment เปรียบเทียบ

## แผนฝึกต่อ (เมื่อพร้อม)

| ระดับ | หัวข้อ | แนะนำ |
|-------|--------|-------|
| ⭐ | Express middleware | เขียน auth check middleware |
| ⭐⭐ | Validation | ใช้ `zod` validate request body |
| ⭐⭐ | Database | ต่อ MongoDB แทน in-memory store |
| ⭐⭐⭐ | NestJS | ย้าย Todo API ไปใช้ NestJS module |
| ⭐⭐⭐ | Auth | JWT login/register |

## Tech Stack

- **TypeScript** — type safety
- **Express** — HTTP server (เบา อ่านง่าย เหมาะฝึกพื้นฐาน)
- **In-memory store** — ไม่ต้อง setup database
