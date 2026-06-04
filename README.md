# 🔐 Mega Project — Auth & Role-based API

A RESTful API built with **NestJS** and **MongoDB** featuring JWT authentication and role-based access control.

🚀 **Live API:** https://mega-project-production-0d11.up.railway.app

---

## ✨ Features

- JWT Authentication (Register / Login)
- Role-based Access Control (Admin / User)
- Protected Endpoints with Guards
- Password hashing with bcrypt
- MongoDB with Mongoose

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | NestJS |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + Passport |
| Deploy | Railway |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/panapolll/-mega-project.git
cd -mega-project

# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Random secret string (min 32 chars) | `supersecretkey123...` |
| `PORT` | Server port | `3000` |

### Running the App

```bash
# Development (with hot reload)
yarn start:dev

# Production
yarn start:prod
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login and get JWT token | ❌ |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Get current user info | ✅ User |
| GET | `/users/admin` | Get all users | ✅ Admin |
| GET | `/users/:id` | Get user by ID | ✅ Admin |
| GET | `/users/email/:email` | Get user by email | ✅ Admin |

---

## 📝 Example Usage

### Register
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}

// Response
{
  "access_token": "eyJhbGci..."
}
```

### Get Profile
```
GET /users/me
Authorization: Bearer <access_token>
```

---

## 👤 Roles

| Role | Description |
|------|-------------|
| `user` | Default role — can access own profile only |
| `admin` | Can access all users and manage the system |

### Creating an Admin Account

Admin accounts cannot be created via public registration. Use the following endpoint directly:

```json
POST /auth/register
{
  "email": "admin@example.com",
  "password": "adminpassword",
  "role": "admin"
}
```

---

## ❗ Error Responses

| Status | Description |
|--------|-------------|
| `401 Unauthorized` | Missing or invalid JWT token |
| `403 Forbidden` | Valid token but insufficient role |
| `404 Not Found` | Resource not found |
| `400 Bad Request` | Missing or invalid request body |
