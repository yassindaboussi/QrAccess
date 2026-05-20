# 🎟️ QrAccess - QR Code Access Management System

<div align="center">

![QrAccess](https://img.shields.io/badge/QrAccess-v1.0.0-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-informational?style=flat-square)
![Repository](https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square)

*A comprehensive, production-ready QR code-based access control system for stadiums, events, gyms, and facilities with subscription management.*

[🌐 Web App](#-frontend-web-application) • [⚙️ Backend API](#-backend-api) • [📱 Mobile App](#-mobile-application) • [🚀 Quick Start](#-quick-start)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [🏗️ Project Architecture](#-project-architecture)
- [🌐 Frontend Web Application](#-frontend-web-application)
- [⚙️ Backend API](#-backend-api)
- [📱 Mobile Application](#-mobile-application)
- [🚀 Quick Start](#-quick-start)
- [📊 Tech Stack](#-tech-stack)
- [🔐 Security Features](#-security-features)
- [🎯 Key Features](#-key-features)
- [📁 Project Structure](#-project-structure)
- [🛠️ Contributing](#-contributing)
- [📝 License](#-license)

---

## Overview

**QrAccess** is an enterprise-grade QR code access management solution designed for venues and facilities requiring subscription-based entry control. The system enables seamless ticketing, real-time access tracking, and comprehensive analytics across web, mobile, and backend infrastructure.

### Why QrAccess? ✨

- ✅ **Contactless Entry** - Safe, fast, and hygienic access control
- ✅ **Subscription Management** - Automated subscription tracking and validation
- ✅ **Real-time Analytics** - Monitor access patterns and venue capacity
- ✅ **Multi-platform** - Web dashboard, mobile scanner, and API
- ✅ **Enterprise Ready** - Security, scalability, and reliability built-in
- ✅ **Easy Deployment** - Docker support for quick setup

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     QrAccess System                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │  Web Dashboard   │  │  Mobile Scanner  │  │   Admin    │ │
│  │  (Next.js +TS)   │  │   (Kotlin)       │  │   Portal   │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬───┘ │
│           │                     │                     │      │
│           └─────────────────────┼─────────────────────┘      │
│                                 │                             │
│                    ┌────────────▼──────────────┐              │
│                    │   REST API Server         │              │
│                    │   (Express.js + Node)     │              │
│                    │   :5000                   │              │
│                    └────────────┬──────────────┘              │
│                                 │                             │
│                    ┌────────────▼──────────────┐              │
│                    │    MongoDB Database       │              │
│                    │  (User, QR, Subscription) │              │
│                    └───────────────────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 Frontend Web Application

### 📍 Location: `/qr-access-frontend`

A modern, responsive web dashboard built with **Next.js 16** and **TypeScript** for administrators and venue managers to manage access, view analytics, and generate QR codes.

#### 🎨 Technologies

| Technology | Purpose |
|-----------|---------|
| **Next.js 16.1.6** | React framework with server-side rendering |
| **TypeScript 5** | Type-safe JavaScript development |
| **React 19.2.3** | UI component library |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **React Hook Form 7.71** | Form validation and state management |
| **Zod 4.3.6** | Schema validation |
| **Axios 1.13.5** | HTTP client for API communication |
| **TanStack React Query** | Server state management and caching |
| **Recharts 3.7.0** | Data visualization and charts |
| **QRCode.React 4.2.0** | QR code generation |
| **Heroicons & Lucide React** | Icon libraries |
| **React Hot Toast** | Toast notifications |

#### ✨ Key Features

- 🎯 **Dashboard** - Real-time access statistics and analytics
- 📊 **Reports** - Detailed scan history and venue analytics
- 🎟️ **QR Generation** - Create and customize QR codes for subscriptions
- 👥 **User Management** - Add, edit, and manage subscribers
- 📧 **Email Integration** - Send QR codes directly to users
- 🔐 **Authentication** - JWT-based session management
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- 🔄 **Real-time Updates** - Live data syncing with React Query

#### 🏃 Getting Started

```bash
cd qr-access-frontend

# Install dependencies
npm install

# Development server
npm run dev
# Open http://localhost:3000

# Production build
npm run build
npm start

# Linting
npm run lint
```

#### 📂 Project Structure

```
qr-access-frontend/
├── src/
│   ├── app/              # Next.js app directory (routes & pages)
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and API clients
│   └── middleware.ts     # Next.js middleware for auth
├── public/               # Static assets
├── package.json
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── next.config.ts        # Next.js configuration
```

---

## ⚙️ Backend API

### 📍 Location: `/qr-access-backend`

A robust, scalable Node.js/Express API server with MongoDB for managing users, QR codes, subscriptions, and access logs with complete authentication and authorization.

#### 🛠️ Technologies

| Technology | Purpose |
|-----------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js 4.18** | Web framework |
| **MongoDB 6+** | NoSQL database |
| **Mongoose 9.2** | MongoDB object modeling |
| **JWT (jsonwebtoken)** | Authentication & authorization |
| **Bcryptjs 3.0** | Password hashing and security |
| **QRCode 1.5** | QR code generation |
| **Nodemailer 8.0** | Email notifications |
| **Helmet 8.1** | Security headers middleware |
| **CORS 2.8** | Cross-origin resource sharing |
| **Express-Validator 7.3** | Input validation |
| **Compression 1.8** | Response compression |
| **Morgan 1.10** | HTTP request logging |
| **Express-Rate-Limit** | DDoS protection & rate limiting |
| **XSS-Clean & Sanitize** | Security against XSS & injection attacks |

#### ✨ Core Features

- 🔐 **Authentication** 
  - JWT-based authentication with refresh tokens
  - Password hashing with bcryptjs
  - Role-based access control (Super Admin, Admin, Scanner)

- 👥 **User Management**
  - Create, read, update, delete users
  - Profile management
  - Subscription tracking
  - User role assignments

- 🎟️ **QR Code System**
  - Generate unique QR codes per subscription
  - QR code validation and expiration
  - Bulk QR code generation
  - QR code history tracking

- 🔄 **Subscription Management**
  - Active/inactive subscription tracking
  - Subscription expiration handling
  - Renewal management
  - Status logging

- 📊 **Scan & Access Logging**
  - Complete audit trail of all scans
  - Timestamp recording
  - Location tracking
  - Scan validity verification
  - Duplicate scan detection

- 📧 **Email Notifications**
  - Send QR codes via email
  - Welcome emails
  - Subscription expiration alerts
  - Access confirmations

- 📈 **Analytics & Reports**
  - Real-time scan statistics
  - Peak usage hours analysis
  - Daily/weekly/monthly reports
  - User access patterns

- 🔒 **Security Features**
  - Rate limiting to prevent abuse
  - CORS configuration
  - Helmet security headers
  - Input sanitization & validation
  - XSS protection
  - CSRF tokens
  - Request logging & monitoring
  - Graceful error handling

#### 🚀 API Endpoints Structure

```
/api/v1/
├── /auth
│   ├── POST   /register          # User registration
│   ├── POST   /login             # User login
│   ├── POST   /refresh           # Refresh JWT token
│   └── POST   /logout            # User logout
│
├── /users
│   ├── GET    /                  # List all users
│   ├── GET    /:id               # Get user details
│   ├── POST   /                  # Create new user
│   ├── PUT    /:id               # Update user
│   └── DELETE /:id               # Delete user
│
├── /qrcodes
│   ├── GET    /                  # List QR codes
│   ├── GET    /:id               # Get QR code details
│   ├── POST   /generate          # Generate new QR code
│   ├── POST   /validate          # Validate QR code
│   └── DELETE /:id               # Delete QR code
│
├── /subscriptions
│   ├── GET    /                  # List subscriptions
│   ├── GET    /:id               # Get subscription details
│   ├── POST   /                  # Create subscription
│   ├── PUT    /:id               # Update subscription
│   ├── PUT    /:id/renew         # Renew subscription
│   └── DELETE /:id               # Cancel subscription
│
├── /scans
│   ├── GET    /                  # List all scans
│   ├── GET    /stats             # Get scan statistics
│   ├── POST   /record            # Record a scan
│   └── GET    /user/:userId      # Get user's scan history
│
├── /admin
│   ├── GET    /dashboard         # Dashboard statistics
│   ├── GET    /analytics         # Detailed analytics
│   └── GET    /health            # System health check
│
└── /health                         # API health endpoint
```

#### 🏃 Getting Started

```bash
cd qr-access-backend

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your MongoDB URI and configuration

# Database commands
npm run db:seed              # Seed initial data
npm run create:admin         # Create admin user
npm run db:backup            # Backup database
npm run db:clear             # Clear database

# Development
npm run dev                  # Start with nodemon (auto-reload)

# Production
npm run prod                 # Start in production mode

# Server runs on http://localhost:5000
# API available at http://localhost:5000/api/v1
```

#### 📂 Project Structure

```
qr-access-backend/
├── src/
│   ├── config/              # Configuration files (app, database)
│   ├── controllers/         # Route handlers & business logic
│   ├── models/              # MongoDB schemas (User, QR, Subscription)
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic & utilities
│   ├── middlewares/         # Auth, validation, error handling
│   ├── validations/         # Input validation schemas
│   └── utils/               # Helper functions & logger
├── scripts/                 # Database scripts (seed, backup, admin)
├── server.js                # Entry point
├── package.json
└── .env.example             # Environment variables template
```

#### 🗄️ Database Models

```
User Schema:
├── email (unique)
├── password (hashed)
├── name
├── role (Super Admin, Admin, Scanner)
├── subscription
├── createdAt
└── updatedAt

QRCode Schema:
├── code (unique)
├── userId (reference)
├── subscriptionId (reference)
├── isValid
├── expiresAt
├── createdAt
└── updatedAt

Subscription Schema:
├── userId (reference)
├── startDate
├── endDate
├── status (active/expired)
├── type (monthly/yearly)
├── price
└── updatedAt

Scan Log Schema:
├── qrcodeId (reference)
├── userId (reference)
├── location
├── timestamp
├── status (valid/expired/invalid)
└── metadata
```

---

## 📱 Mobile Application

### 📍 Location: `/Qraccess`

A native **Android** mobile application built with **Kotlin** for venue staff to scan and validate QR codes in real-time with offline support capabilities.

#### 🛠️ Technologies

| Technology | Purpose |
|-----------|---------|
| **Kotlin** | Modern Android development language |
| **Android SDK** | Native Android framework |
| **Gradle 8.5+** | Build system and dependency management |
| **Material Design 3** | UI/UX design system |
| **Room Database** | Local data persistence |
| **Jetpack Compose** | Modern UI framework (optional) |
| **Retrofit/OkHttp** | HTTP client & networking |
| **ML Kit QR Scanner** | QR code scanning & recognition |

#### ✨ Key Features

- 📸 **QR Code Scanner**
  - Real-time camera-based scanning
  - Instant QR code recognition
  - Visual feedback and notifications

- ✅ **Validation Engine**
  - Verify QR code authenticity
  - Check subscription status
  - Validate expiration dates
  - Offline validation capability

- 📊 **Scan Results**
  - Display access granted/denied status
  - Show user subscription information
  - Log scan details
  - Sync with backend

- 👤 **User Information Display**
  - Show scanned user details
  - Subscription status
  - Access history
  - User photo/avatar

- 🔄 **Offline Mode**
  - Cache QR code data locally
  - Perform scans without internet
  - Auto-sync when connection restored
  - Offline indicator

- 🔐 **Authentication**
  - Secure login for staff
  - Session management
  - Role-based permissions
  - Logout functionality

- ⚙️ **Settings & Configuration**
  - Select venue/location
  - Configure scanner behavior
  - Network preferences
  - User profile management

- 📋 **History & Logs**
  - View scan history
  - Filter by date/time
  - Search functionality
  - Export capabilities

#### 🏃 Getting Started

```bash
cd Qraccess

# Install dependencies (Android Studio automatically manages Gradle)
# Open project in Android Studio

# Build the project
./gradlew build

# Run on emulator/device
./gradlew installDebug

# Build release APK
./gradlew assembleRelease

# Run tests
./gradlew test
```

#### 📂 Project Structure

```
Qraccess/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/yourcompany/qraccess/
│   │   │   │   ├── ui/                 # UI screens & fragments
│   │   │   │   ├── viewmodel/          # MVVM ViewModels
│   │   │   │   ├── repository/         # Data repositories
│   │   │   │   ├── model/              # Data classes
│   │   │   │   ├── database/           # Room database
│   │   │   │   ├── api/                # Retrofit services
│   │   │   │   ├── utils/              # Utility functions
│   │   │   │   └── MainActivity.kt
│   │   │   └── res/
│   │   │       ├── layout/             # XML layouts
│   │   │       ├── drawable/           # Images & drawables
│   │   │       ├── values/             # Colors, strings, dimensions
│   │   │       └── menu/               # Menu definitions
│   │   └── test/                       # Unit tests
│   ├── build.gradle.kts                # Module build configuration
│   └── proguard-rules.pro              # ProGuard obfuscation rules
├── build.gradle.kts                    # Project build configuration
├── settings.gradle.kts                 # Gradle settings
└── gradle.properties                   # Gradle properties
```

#### 🔧 Build Configuration

```gradle
Android SDK: API 34+
Minimum SDK: API 24 (Android 7.0)
Target SDK: API 34 (Android 14)
Language: Kotlin
Build System: Gradle 8.5+
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **MongoDB** 6+ (local or Atlas)
- **npm** or **yarn**
- **Android Studio** (for mobile app)
- **Kotlin** 1.9+

### Setup Instructions

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/yassindaboussi/QrAccess.git
cd QrAccess
```

#### 2️⃣ Backend Setup

```bash
cd qr-access-backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/qraccess
# or MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/qraccess

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# QR Code
QR_CODE_EXPIRY_DAYS=365
EOF

# Run database setup
npm run create:admin       # Create admin user
npm run db:seed            # Seed sample data

# Start server
npm run dev
# Server running at http://localhost:5000
```

#### 3️⃣ Frontend Setup

```bash
cd qr-access-frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Dashboard available at http://localhost:3000
```

#### 4️⃣ Mobile Setup

```bash
cd Qraccess

# Open in Android Studio
# File > Open > Select Qraccess folder
# Android Studio will automatically configure and sync Gradle

# Build and run on emulator/device
./gradlew assembleDebug
```

### 🧪 Testing the System

```bash
# 1. Access web dashboard
http://localhost:3000

# 2. Test API endpoints
curl http://localhost:5000/health

# 3. Login with admin account
# Email: admin@qraccess.com
# Password: (check console output after npm run create:admin)

# 4. Generate QR codes and test mobile scanner
```

---

## 📊 Tech Stack

### Frontend
- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **State**: React Query, React Hook Form
- **Validation**: Zod
- **HTTP**: Axios
- **Charts**: Recharts
- **UI Components**: Headless UI, Heroicons

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting, XSS Protection
- **Email**: Nodemailer
- **QR Generation**: qrcode library
- **Utilities**: bcryptjs, express-validator, morgan

### Mobile
- **Language**: Kotlin
- **Platform**: Android (API 24+)
- **Build System**: Gradle 8.5+
- **Architecture**: MVVM with Jetpack
- **QR Scanner**: ML Kit
- **Local Storage**: Room Database
- **HTTP Client**: Retrofit/OkHttp

---

## 🔐 Security Features

### Backend Security

✅ **Authentication & Authorization**
- JWT-based token authentication
- Refresh token mechanism
- Role-based access control (RBAC)
- Secure password hashing with bcryptjs

✅ **Protection Against Attacks**
- CORS configuration
- Helmet.js security headers
- Express rate limiting (prevent brute force)
- XSS protection with xss-clean
- MongoDB injection prevention with express-mongo-sanitize
- CSRF token support
- Input validation & sanitization

✅ **Data Security**
- Encrypted password storage
- Secure token storage
- Database access control
- Audit logging

✅ **API Security**
- Request/response validation
- Error handling (no sensitive info leakage)
- Graceful shutdown handling
- Process monitoring

### Frontend Security

✅ **Client-side Protection**
- JWT token storage (secure cookies)
- HTTPS-only mode
- Content Security Policy
- Input validation before submission
- Protected routes with middleware

### Mobile Security

✅ **Application Security**
- Secure local storage
- Encrypted API communication
- Certificate pinning capability
- Secure credential handling
- ProGuard code obfuscation

---

## 🎯 Key Features

### 🎟️ Access Management
- QR code generation and management
- Subscription validation
- Real-time access control
- Expiration handling

### 📊 Analytics & Reporting
- Real-time scan statistics
- User access patterns
- Venue capacity tracking
- Peak hours analysis
- Custom date range reports

### 👥 User Management
- User registration and authentication
- Profile management
- Role assignments
- Subscription tracking
- Batch user operations

### 📧 Notifications
- Email delivery of QR codes
- Subscription expiration alerts
- Access confirmations
- System notifications

### 🔄 Integration
- RESTful API
- Mobile app integration
- Email system integration
- Third-party service support

---

## 📁 Project Structure

```
QrAccess/
├── qr-access-backend/              # Express.js API Server
│   ├── src/
│   │   ├── config/                 # Configuration
│   │   ├── controllers/            # Route handlers
│   │   ├── models/                 # MongoDB schemas
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic
│   │   ├── middlewares/            # Express middleware
│   │   ├── validations/            # Input validation
│   │   └── utils/                  # Helper utilities
│   ├── scripts/                    # Setup scripts
│   ├── server.js                   # Entry point
│   └── package.json
│
├── qr-access-frontend/             # Next.js Web Dashboard
│   ├── src/
│   │   ├── app/                    # Next.js app directory
│   │   ├── components/             # React components
│   │   ├── lib/                    # Utilities
│   │   └── middleware.ts           # Next middleware
│   ├── public/                     # Static files
│   └── package.json
│
├── Qraccess/                       # Android Mobile App
│   ├── app/
│   │   └── src/
│   │       ├── main/
│   │       │   ├── java/           # Kotlin source code
│   │       │   └── res/            # Resources
│   │       └── test/               # Tests
│   └── build.gradle.kts
│
└── README.md                       # This file
```

---

## 🛠️ Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow existing code style
- Use TypeScript for frontend/backend
- Add comments for complex logic
- Test your changes
- Update documentation

---

## 📞 Support & Documentation

- **API Documentation**: See backend README
- **Frontend Guide**: See frontend README
- **Mobile Guide**: See Qraccess README
- **Issues**: [GitHub Issues](https://github.com/yassindaboussi/QrAccess/issues)

---

## 🤝 Acknowledgments

- Built with ❤️ using modern technologies
- Thanks to the open-source community

---

## 📝 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Yassin Daboussi**
- GitHub: [@yassindaboussi](https://github.com/yassindaboussi)
- Email: [Contact via GitHub](https://github.com/yassindaboussi)

---

<div align="center">

### Made with ❤️ by Yassin Daboussi

⭐ If you find this project helpful, please consider giving it a star!

[⬆ Back to top](#-qraccess---qr-code-access-management-system)

</div>
