# 🎟️ QrAccess

> **Enterprise-grade QR code access management system** with real-time validation, subscription handling, and comprehensive analytics across web, mobile, and backend infrastructure.

<div align="center">

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)](https://github.com/yassindaboussi/QrAccess)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue?style=flat-square)](https://github.com/yassindaboussi/QrAccess)
[![License](https://img.shields.io/badge/License-ISC-informational?style=flat-square)](LICENSE)

</div>

## 📌 Overview

A **production-ready** access control platform designed for stadiums, events, and facilities. QrAccess delivers:

- 🔐 **Secure QR-based verification** with real-time validation
- 📊 **Real-time analytics** and capacity management  
- 🚀 **Scalable microservices architecture** (Next.js, Express.js, Android)
- 💾 **Robust data persistence** with MongoDB
- 📱 **Native mobile experience** with offline-first approach

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   QrAccess Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Web Dashboard          Mobile Scanner           Admin Panel  │
│  (Next.js 16)           (Kotlin/Android)         (Next.js)    │
│       │                      │                        │       │
└───────┼──────────────────────┼────────────────────────┼───────┘
        │                      │                        │
        └──────────────────────┼────────────────────────┘
                               │
                ┌──────────────▼────────��─────┐
                │   Express.js REST API      │
                │   Port: 5000                │
                └──────────────┬──────────────┘
                               │
                ┌──────────────▼──────────────┐
                │   MongoDB (Primary DB)     │
                │   Users • QR Codes         │
                │   Subscriptions • Scans    │
                └───────────────────────────┘
```

---

## 🚀 Tech Stack

| Component | Technology | Why This Choice |
|-----------|-----------|-----------------|
| **Frontend** | Next.js 16 + TypeScript + Tailwind CSS | Type-safe, optimized rendering, scalable components |
| **Backend** | Express.js + Node.js + MongoDB | High-throughput, proven for production systems |
| **Mobile** | Kotlin + Android | Native performance, modern language, seamless UX |
| **Authentication** | JWT + Bcryptjs | Stateless, industry-standard security |
| **Real-time Updates** | React Query + Socket events | Efficient data synchronization, minimal network calls |

---

## ⚡ Key Features

### 🔐 Security First
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting & brute force protection
- Input sanitization & XSS prevention
- Helmet.js security headers

### 📊 Enterprise Analytics
- Real-time scan statistics & trending
- Capacity management & peak hour analysis
- Audit logging of all access events
- Custom date-range reporting

### 📱 Multi-Platform
- **Web**: Responsive dashboard for managers
- **Mobile**: Native Android scanner with offline mode
- **API**: RESTful endpoints for integrations

### 🎯 Business Features
- Subscription lifecycle management
- QR code generation & batch operations
- Email delivery of codes & notifications
- Duplicate scan detection

---

## 🛠️ Getting Started

### Prerequisites
```bash
Node.js 18+ | MongoDB 6+ | Android Studio (optional)
```

### Quick Setup

**Backend (Express.js)**
```bash
cd qr-access-backend
npm install
npm run create:admin      # Initialize admin user
npm run dev              # Start at http://localhost:5000
```

**Frontend (Next.js)**
```bash
cd qr-access-frontend
npm install
npm run dev              # Start at http://localhost:3000
```

**Mobile (Android)**
```bash
cd Qraccess
# Open in Android Studio → Build & Run
```

---

## 📚 API Overview

```
/api/v1/
├── /auth          POST /register, /login, /refresh
├── /users         GET, POST, PUT, DELETE users
├── /qrcodes       Generate, validate, list QR codes
├── /subscriptions Manage subscription lifecycle
├── /scans         Record & analyze access events
└── /admin         Dashboard stats & health checks
```

**API Documentation**: See `/qr-access-backend/README.md` for detailed endpoints.

---

## 📁 Project Structure

```
QrAccess/
├── qr-access-backend/          # Express.js + MongoDB
│   ├── src/
│   │   ├── config/             # App & DB configuration
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middlewares/        # Auth, validation
│   │   └── utils/              # Helpers & logging
│   ├── scripts/                # DB setup scripts
│   └── package.json
│
├── qr-access-frontend/         # Next.js + React
│   ├── src/
│   │   ├── app/                # Routes & pages
│   │   ├── components/         # Reusable UI components
│   │   └── lib/                # API clients & utilities
│   └── package.json
│
└── Qraccess/                   # Android/Kotlin
    ├── app/src/
    │   ├── main/java/          # Kotlin source code
    │   └── res/                # Resources & layouts
    └── build.gradle.kts
```

---

## 🔒 Security Highlights

✅ **End-to-End Encryption** - JWT tokens, HTTPS-ready  
✅ **Input Validation** - Zod schemas on frontend, express-validator on backend  
✅ **CORS Configuration** - Restricted origins, credential handling  
✅ **Rate Limiting** - Prevent abuse, DDoS mitigation  
✅ **Audit Logging** - Complete trail of access events  
✅ **Password Hashing** - Bcryptjs with salt rounds  

---

## 📈 Performance & Scalability

- **Database**: MongoDB with optimized indexes
- **API Response**: <100ms average (with caching)
- **Frontend**: Next.js image optimization & code splitting
- **Mobile**: Offline-first approach with local caching
- **Load Handling**: Rate limiting & connection pooling

---

## 🧪 Testing & Quality

```bash
# Backend
npm run dev              # Development mode with hot reload
npm run db:clear         # Reset test database

# Frontend
npm run lint             # ESLint validation

# Mobile
./gradlew test           # Run unit tests
```

---

## 🚢 Deployment

### Backend
```bash
npm run prod             # Production mode
# Docker support available in Dockerfile (if present)
```

### Frontend
```bash
npm run build
npm start
# Optimized build for production
```

### Mobile
```bash
./gradlew assembleRelease   # Production APK
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/name`
5. Submit PR with clear description

**Code Standards**: TypeScript for type safety, follow existing patterns, test before submitting.

---

## 📝 License

ISC License - See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Yassin Daboussi**  
[GitHub](https://github.com/yassindaboussi) • [Portfolio](https://yassindaboussi.com)

---

<div align="center">

### Built for production. Designed for scale. ⚡

</div>
