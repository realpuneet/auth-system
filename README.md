# 🔐 MERN Authentication System with Role-based Access & Redis

A production-grade authentication workflow built using **Node.js**, **Express**, **MongoDB**, and **Redis**.  
This setup includes **JWT authentication**, **cookie-based sessions**, **role-based access**, and **input validation with Joi**.

---

## ⚙️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Cache/Session:** Redis (ioredis)
- **Validation:** Joi
- **Auth:** JWT + Cookie
- **Logger:** Custom utility (console wrapper)

---

## 1  Clone the repo
```bash
git clone https://github.com/your-username/mern-auth-redis.git
cd mern-auth-redis

## 2 Install dependencies
npm install

## 3 Add environment variables in .env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password
NODE_ENV=development

## 4 Start the server
npm start


## API Testing with Postman

#Register User
POST → /api/auth/register

{
  "email": "test@gmail.com",
  "password": "12345678",
  "role": "admin"  // optional ("user" by default)
}

#Login User
POST → /api/auth/login

{
  "email": "test@gmail.com",
  "password": "12345678"
}

#Logout
POST → /api/auth/logout

#Admin-only Route
GET → /api/auth/admin/getdata
## Works only if the logged-in user has role: admin