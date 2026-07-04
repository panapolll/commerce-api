# 🍎 Fruit Shop — Commerce API

NestJS microservice สำหรับจัดการสินค้า ตะกร้า ออเดอร์ และชำระเงินผ่าน Omise

## ✨ Features

- Product CRUD (admin only)
- Shopping cart (เพิ่ม / ลบสินค้า)
- Stock management (ลด stock ตอน add to cart, คืน stock ตอน remove)
- Order checkout (สร้าง order สถานะ PENDING)
- Omise payment charge (อัปเดต order เป็น PAID)
- ล้างตะกร้าหลังชำระเงินสำเร็จ
- JWT authentication (ใช้ secret ร่วมกับ Auth Service)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS |
| Database | MongoDB + Mongoose |
| Auth | JWT + Passport |
| Payment | Omise |
| Language | TypeScript |

## 🏗️ Architecture

```
API Gateway (:3004)
  └── Commerce API (:3000)  ← this repo
        ├── MongoDB
        └── Omise API
```

## 🔗 Related Repositories

| Service | Repository |
|---------|------------|
| Frontend | [fruit-shop-frontend](https://github.com/panapolll/fruit-shop-frontend) |
| API Gateway | [Api-Gateway](https://github.com/panapolll/Api-Gateway) |
| Auth Service | [Auth-Service](https://github.com/panapolll/Auth-Service) |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local หรือ Atlas)
- Omise test account keys

### Installation

```bash
git clone https://github.com/panapolll/commerce-api.git
cd commerce-api
yarn install
cp .env.example .env
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/fruitshop` |
| `JWT_SECRET` | ต้องตรงกับ Auth Service | `your-shared-secret` |
| `OMISE_PUBLIC_KEY` | Omise public key | `pkey_test_xxx` |
| `OMISE_SECRET_KEY` | Omise secret key | `skey_test_xxx` |
| `PORT` | Server port | `3000` |

### Seed Data

```bash
yarn seed
# สร้าง admin + สินค้าตัวอย่าง
```

### Running

```bash
# Development
yarn start:dev

# Production
yarn build && yarn start:prod
```

## 📡 API Endpoints

### Products

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/products` | ❌ | — | ดูสินค้าทั้งหมด |
| GET | `/products/:id` | ❌ | — | ดูสินค้าตาม ID |
| POST | `/products` | ✅ | admin | สร้างสินค้า |
| PUT | `/products/:id` | ✅ | admin | แก้ไขสินค้า |
| DELETE | `/products/:id` | ✅ | admin | ลบสินค้า |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | ✅ | ดูตะกร้า |
| POST | `/cart/items` | ✅ | เพิ่มสินค้า `{ productId, quantity }` |
| DELETE | `/cart/items/:productId` | ✅ | ลบสินค้าออกจากตะกร้า |

### Orders

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/orders/checkout` | ✅ | user | สร้าง order จากตะกร้า |
| GET | `/orders/me` | ✅ | user | ดูออเดอร์ของตัวเอง |
| GET | `/orders` | ✅ | admin | ดูออเดอร์ทั้งหมด |
| PATCH | `/orders/:id/status` | ✅ | admin | อัปเดตสถานะ order |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/charge` | ✅ | ชำระเงิน Omise `{ orderId, token }` |
| POST | `/payments/webhook` | ❌ | Omise webhook (optional) |

## 🔄 Stock Management Flow

```
Add to cart      → stock -1
Remove from cart → stock +1
Payment success  → order = PAID + ล้างตะกร้า
```

## 🐳 Docker

```bash
docker build -t commerce-api .
docker run -p 3000:3000 --env-file .env commerce-api
```

## 👨‍💻 Author

Portfolio project — microservices e-commerce with payment integration.