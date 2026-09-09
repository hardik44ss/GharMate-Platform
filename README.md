# 🏠 GharMate

**GharMate** is a full-stack construction management platform that connects **clients with contractors** and helps manage construction projects in one place.

## ✨ Features

* 👤 **Role-based access** — Client, Contractor & Admin
* 🔐 **JWT authentication** and protected APIs
* 🔎 **Contractor discovery** and profiles
* 📋 **Project management** and contractor bidding
* 🪪 **KYC verification** for contractors
* ⭐ **Ratings & reviews**
* 🛡️ Backend security with rate limiting, Helmet and input sanitization
* 🧪 REST API testing with Postman

## 🛠️ Tech Stack

**Frontend:** React.js, TypeScript, Vite, Tailwind CSS
**Backend:** Node.js, Express.js, REST APIs
**Database:** MongoDB, Mongoose, MongoDB Atlas
**Authentication:** JWT, bcrypt
**Tools & Deployment:** Git, GitHub, Postman, Vercel, Render

## 🏗️ Architecture

```text
React Frontend
      ↓
REST APIs
      ↓
Node.js + Express
      ↓
MongoDB + Mongoose
```

## 🚀 Run Locally

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

Create a `.env` file in the `backend` folder:

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## 🌐 Links

**Live Demo:** https://ghar-mate-platform.vercel.app/
**GitHub:** https://github.com/hardik44ss/GharMate-Platform

## 👨‍💻 Author

**Hardik Suthar**
Computer Science Engineering Student — Chandigarh University

[GitHub](https://github.com/hardik44ss) · [LinkedIn](https://www.linkedin.com/in/hardik44s)
