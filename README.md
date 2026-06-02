🔐 Mega Project — Auth & Role-based API
A RESTful API built with NestJS and MongoDB featuring authentication, role-based access control, and protected endpoints.
🚀 Live API: https://mega-project-production-0d11.up.railway.app

✨ Features

JWT Authentication (Register / Login)
Role-based Access Control (Admin / User)
Protected Endpoints with Guards
Password hashing with bcrypt
MongoDB with Mongoose


🛠️ Tech Stack

Framework: NestJS
Database: MongoDB Atlas + Mongoose
Auth: JWT + Passport
Deploy: Railway


🚀 Getting Started
Prerequisites

Node.js 18+
MongoDB Atlas account

Installation
bash# Clone the repository
git clone https://github.com/panapolll/-mega-project.git

# Install dependencies
yarn install

# Create .env file
cp .env.example .env
Environment Variables
envMONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
Running the app
bash# Development
yarn start:dev

# Production
yarn start:prod

📡 API Endpoints
Auth
MethodEndpointDescriptionAuthPOST/auth/registerRegister new user❌POST/auth/loginLogin and get JWT token❌
Users
MethodEndpointDescriptionAuthGET/users/meGet current user info✅ UserGET/users/adminGet all users✅ AdminGET/users/:idGet user by ID✅ AdminGET/users/email/:emailGet user by email✅ Admin

📝 Example Usage
Register
jsonPOST /auth/register
{
  "email": "user@example.com",
  "password": "yourpassword"
}
Login
jsonPOST /auth/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}

// Response
{
  "access_token": "eyJhbGci..."
}
Get Profile
GET /users/me
Authorization: Bearer <access_token>

👤 Roles
RoleDescriptionuserDefault role — can access own profile onlyadminCan access all users and manage the system

Admin accounts are created directly via API endpoint — not available through public registration.
