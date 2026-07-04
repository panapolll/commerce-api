# 🍎 Fruit Shop — Commerce API

NestJS microservice for product catalog, shopping cart, order management, and Omise payment processing.

## ✨ Features

- Product CRUD with admin role guard
- Shopping cart (add / remove items)
- Stock management (decrease on add-to-cart, restore on remove)
- Order checkout (creates PENDING order)
- Omise payment charge (updates order to PAID)
- JWT authentication via shared secret with Auth Service

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
- MongoDB (local or Atlas)
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
| `JWT_SECRET` | Must match Auth Service secret | `your-shared-secret` |
| `OMISE_PUBLIC_KEY` | Omise public key | `pkey_test_xxx` |
| `OMISE_SECRET_KEY` | Omise secret key | `skey_test_xxx` |
| `PORT` | Server port | `3000` |

### Seed Data

```bash
yarn seed
# Creates admin user + sample fruit products
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
| GET | `/products` | ❌ | — | List all products |
| GET | `/products/:id` | ❌ | — | Get product by ID |
| POST | `/products` | ✅ | admin | Create product |
| PUT | `/products/:id` | ✅ | admin | Update product |
| DELETE | `/products/:id` | ✅ | admin | Delete product |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | ✅ | Get user cart |
| POST | `/cart/items` | ✅ | Add item `{ productId, quantity }` |
| DELETE | `/cart/items/:productId` | ✅ | Remove item |

### Orders

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/orders/checkout` | ✅ | user | Create order from cart |
| GET | `/orders/me` | ✅ | user | Get my orders |
| GET | `/orders` | ✅ | admin | Get all orders |
| PATCH | `/orders/:id/status` | ✅ | admin | Update order status |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/charge` | ✅ | Charge via Omise `{ orderId, token }` |
| POST | `/payments/webhook` | ❌ | Omise webhook (optional) |

## 🔄 Stock Management Flow

```
Add to cart    → stock -1
Remove from cart → stock +1
Payment success  → order status = PAID + clear cart
```

## 🐳 Docker

```bash
docker build -t commerce-api .
docker run -p 3000:3000 --env-file .env commerce-api
```

## 👨‍💻 Author

Portfolio project — microservices e-commerce with payment integration.
