# 🔀 Fruit Shop — API Gateway

API Gateway that routes frontend requests to Auth Service and Commerce API.

## 🏗️ Architecture

```
Frontend (:5173)
  └── API Gateway (:3004)  ← this repo
        ├── Auth Service     → /auth/*
        ├── Commerce API     → /products, /cart, /orders, /payments
        └── Notification Service → /notifications/*
```

## 🔗 Related Repositories

| Service | Repository |
|---------|------------|
| Frontend | [fruit-shop-frontend](https://github.com/panapolll/fruit-shop-frontend) |
| Commerce API | [commerce-api](https://github.com/panapolll/commerce-api) |
| Auth Service | [Auth-Service](https://github.com/panapolll/Auth-Service) |
| Notification Service | [notification-service](https://github.com/panapolll/notification-service) |

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
| GET | `/notifications/me` | Notification Service |
| GET | `/notifications/unread-count` | Notification Service |
| PATCH | `/notifications/mark-all-read` | Notification Service |
| PATCH | `/notifications/:id/read` | Notification Service |
| DELETE | `/notifications/:id` | Notification Service |

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
| `NOTIFICATION_SERVICE_URL` | Notification Service URL | `http://localhost:3001` |
| `PORT` | Gateway port | `3004` |

## 👨‍💻 Author

Portfolio project — microservices e-commerce.
