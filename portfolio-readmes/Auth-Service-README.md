# 🔐 Fruit Shop — Auth Service

JWT authentication microservice for the Fruit Shop e-commerce platform.

## ✨ Features

- User registration and login
- JWT access token (15 min expiry)
- Refresh token (1 hour expiry)
- Role-based tokens (`user` / `admin`)
- Deployed on Render

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Deploy | Render |

## 🔗 Related Repositories

| Service | Repository |
|---------|------------|
| Frontend | [fruit-shop-frontend](https://github.com/panapolll/fruit-shop-frontend) |
| API Gateway | [Api-Gateway](https://github.com/panapolll/Api-Gateway) |
| Commerce API | [commerce-api](https://github.com/panapolll/commerce-api) |

## 🚀 Live API

https://auth-service-7xty.onrender.com

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login → access + refresh token |
| POST | `/auth/refresh` | Refresh access token |

## 🚀 Getting Started

```bash
git clone https://github.com/panapolll/Auth-Service.git
cd Auth-Service
yarn install
cp .env.example .env
yarn start:dev
```

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Shared secret (must match Commerce API) |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `PORT` | Server port (default `3100`) |

## 👨‍💻 Author

Portfolio project — microservices e-commerce.
