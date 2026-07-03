# 🍎 Fruit Shop — Frontend

React + Vite frontend for a microservices fruit e-commerce platform with Omise payment integration.

## ✨ Features

- User authentication (login / register)
- Automatic JWT refresh token handling
- Product listing with admin CRUD
- Shopping cart with real-time stock updates
- Checkout flow with Omise card payment (test mode)
- Order history page
- Role-based UI (admin can add/delete products)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Routing | React Router v7 |
| HTTP Client | Axios (with interceptors) |
| Payment | Omise.js |
| Styling | Inline CSS (dark theme) |

## 🏗️ Architecture

```
Frontend (localhost:5173)
  ├── Auth Service (Render)     → login, register, refresh
  └── API Gateway (localhost:3004) → products, cart, orders, payments
        └── Commerce API (localhost:3000)
```

## 🔗 Related Repositories

| Service | Repository |
|---------|------------|
| Commerce API | [commerce-api](https://github.com/panapolll/commerce-api) |
| API Gateway | [Api-Gateway](https://github.com/panapolll/Api-Gateway) |
| Auth Service | [Auth-Service](https://github.com/panapolll/Auth-Service) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- API Gateway running on port `3004`
- Commerce API running on port `3000`
- Auth Service (or use deployed Render URL)

### Installation

```bash
git clone https://github.com/panapolll/fruit-shop-frontend.git
cd fruit-shop-frontend
yarn install
cp .env.example .env
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AUTH_API_URL` | Auth Service URL | `https://auth-service-7xty.onrender.com` |
| `VITE_GATEWAY_URL` | API Gateway URL | `http://localhost:3004` |
| `VITE_OMISE_PUBLIC_KEY` | Omise public key (test) | `pkey_test_xxx` |

### Running

```bash
yarn dev
# Open http://localhost:5173
```

## 📱 User Flow

```
Register → Login → Browse Products → Add to Cart → Checkout → Pay with Omise → Order History
```

## 🧪 Test Payment (Omise Test Mode)

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | `12/2028` |
| CVV | `123` |

## 📁 Project Structure

```
src/
├── api/           # API clients (auth, cart, products, orders, payments)
├── pages/         # Login, Register, Products, Cart, Payment
├── types/         # Omise TypeScript declarations
└── App.tsx        # Routes + token management
```

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `1234567890` |

> Register a new account for regular user role.

## 📸 Screenshots

> Add screenshots to `/screenshots` folder for portfolio display.

## 👨‍💻 Author

Built as a portfolio project demonstrating full-stack microservices architecture.
