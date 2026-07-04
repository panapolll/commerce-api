# 🔀 Fruit Shop — API Gateway

API Gateway that routes frontend requests to Auth Service and Commerce API.

## 🏗️ Architecture

```
Frontend (:5173)
  └── API Gateway (:3004)  ← this repo
        ├── Auth Service     → /auth/*
        └── Commerce API     → /products, /cart, /orders, /payments
```

## 🔗 Related Repositories

| Service | Repository |
|---------|------------|
| Frontend | [fruit-shop-frontend](https://github.com/panapolll/fruit-shop-frontend) |
| Commerce API | [commerce-api](https://github.com/panapolll/commerce-api) |
| Auth Service | [Auth-Service](https://github.com/panapolll/Auth-Service) |

## ✨ Proxied Routes

| Method | Gateway Path | Target Service |
|--------|--------------|----------------|
| POST | `/auth/login` | Auth Service |
| POST | `/auth/register` | Auth Service |
| POST | `/auth/refresh` | Auth Service |
| GET/POST/DELETE | `/products/*` | Commerce API |
| GET/POST/DELETE | `/cart/*` | Commerce API |
| POST | `/orders/checkout` | Commerce API |
| GET | `/orders/me` | Commerce API |
| POST | `/payments/charge` | Commerce API |

## 🚀 Getting Started

```bash
git clone https://github.com/panapolll/Api-Gateway.git
cd Api-Gateway
yarn install
cp .env.example .env
yarn start:dev
```

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SERVICE_URL` | Auth Service URL | `https://auth-service-7xty.onrender.com` |
| `COMMERCE_SERVICE_URL` | Commerce API URL | `http://localhost:3000` |
| `PORT` | Gateway port | `3004` |

## 👨‍💻 Author

Portfolio project — microservices e-commerce.
