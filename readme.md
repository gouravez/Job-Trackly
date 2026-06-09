# Job Trackly

A full-stack job application tracker built for college students, recent graduates, and job seekers. Track every application, visualize progress, and never miss a follow-up.

![Job Trackly](https://img.shields.io/badge/Status-Active-green) ![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![MySQL](https://img.shields.io/badge/MySQL-8-orange)

---

## Features

- **Dashboard** — stats, activity chart, recent applications, follow-up reminders
- **Applications** — table view with search, filter by status, pagination
- **Kanban Board** — drag-and-drop cards across status columns, quick-add
- **Analytics** — funnel, monthly trends, status breakdown, top companies
- **Auth** — email + password with OTP email verification, Google OAuth
- **Settings** — profile, appearance (light/dark/system), change password
- **Dark mode** — full dark mode support across all pages

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  React 18 + Vite · Tailwind CSS · Zustand · Axios          │
│                                                             │
│  Pages: Dashboard · Applications · Kanban · Analytics       │
│         Sign In/Up · Settings · Auth Callback               │
│                                                             │
│  Stores: authStore · appStore · themeStore                  │
│  Services: api.js (Axios + JWT interceptor)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                              │
│  Node.js · Express · Passport · Zod                        │
│                                                             │
│  Middleware: protect (JWT) · validate (Zod) · helmet+cors   │
│                                                             │
│  Routes:                                                    │
│  POST /api/auth/send-otp      → otp.service → email.js     │
│  POST /api/auth/signup        → auth.service (OTP verify)  │
│  POST /api/auth/signin        → auth.service               │
│  GET  /api/auth/google        → passport → Google          │
│  GET  /api/auth/google/cb     → google.service → JWT       │
│  GET  /api/auth/me            → auth.service               │
│  GET/POST/PATCH/DELETE                                      │
│       /api/applications       → application.service        │
│  PUT  /api/users/me/password  → user.service               │
│  PUT  /api/users/me/profile   → user.service               │
└───────┬──────────────────────────┬──────────────────────────┘
        │ mysql2 pool              │ nodemailer / passport
        ▼                          ▼
┌───────────────────┐   ┌──────────────────────────────────┐
│  MySQL            │   │  Third-party services             │
│  Job_Trackly DB   │   │                                  │
│                   │   │  Google OAuth                    │
│  users            │   │  accounts.google.com             │
│  applications     │   │                                  │
│  timeline_events  │   │  SMTP / Email                    │
│  contacts         │   │  Gmail · Resend · etc.           │
│  resumes          │   │                                  │
│  email_otps       │   └──────────────────────────────────┘
└───────────────────┘
```

### Request lifecycle (email/password sign in)

```
Browser → POST /api/auth/signin { email, password }
       → validate middleware (Zod signinSchema)
       → signinController
       → auth.service.signin()
           → pool.query SELECT user WHERE email
           → bcrypt.compare(password, hash)
           → signToken({ userId, email })
       ← { success: true, data: { token, user } }
Browser stores token in localStorage
Zustand authStore.token set → ProtectedRoutes unlock
```

### Request lifecycle (Google OAuth)

```
Browser → GET /api/auth/google
       → Passport redirects to accounts.google.com
User approves Google consent screen
Google → GET /api/auth/google/callback?code=...
       → Passport exchanges code for profile
       → google.service.googleAuth()
           → pool.query SELECT user WHERE email
           → INSERT if new user
           → signToken({ userId, email })
       → res.redirect to /auth/callback?token=...&user=...
AuthCallbackPage reads params
       → localStorage.setItem('token', token)
       → authStore.setAuth({ token, user })
       → navigate('/dashboard')
```

### Request lifecycle (OTP sign up)

```
Step 1 — Send OTP
Browser → POST /api/auth/send-otp { email }
       → otp.service.sendOtp()
           → check email not already registered
           → generate 6-digit OTP
           → bcrypt.hash(otp, 8)
           → INSERT INTO email_otps (upsert on resend)
           → email.js sendOtpEmail() via nodemailer
       ← { success: true }

Step 2 — Verify & create account
Browser → POST /api/auth/signup { ...form, otp }
       → validate (Zod signupSchema — otp required)
       → auth.service.signup()
           → otp.service.verifyOtp(email, otp)
               → fetch hash from email_otps
               → check expiry (10 min)
               → bcrypt.compare(otp, hash)
           → bcrypt.hash(password, 12)
           → INSERT INTO users
           → DELETE FROM email_otps (cleanup)
           → signToken({ userId, email })
       ← { success: true, data: { token, user } }
Browser stores token → redirects to /dashboard
```

---

## Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| React Router v6 | Client-side routing |
| Zustand | State management |
| Tailwind CSS | Styling + dark mode |
| Recharts | Charts and analytics |
| Axios | HTTP client with JWT interceptor |
| Lucide React | Icons |

### Backend
| Library | Purpose |
|---|---|
| Node.js + Express | API server |
| MySQL2 | Database driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| Passport + Google OAuth | Google sign-in |
| Nodemailer | OTP emails |
| Zod | Schema validation |
| Helmet + CORS | Security |

---

## Project Structure

```
Job Trackly/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/       # Charts and stat cards
│   │   │   ├── applications/    # Table, filters, modal
│   │   │   ├── auth/            # Social auth buttons
│   │   │   ├── common/          # Shared UI primitives
│   │   │   ├── dashboard/       # Dashboard widgets
│   │   │   ├── kanban/          # Board, columns, cards
│   │   │   ├── layout/          # Sidebar, navbar, layouts
│   │   │   └── ui/              # Button, Input, Logo
│   │   ├── pages/               # Route-level page components
│   │   ├── services/            # Axios API service layer
│   │   ├── store/               # Zustand stores (auth, app, theme)
│   │   └── lib/                 # Utilities and mock data
│   ├── .env.example
│   └── package.json
│
└── backend/
    ├── database/
    │   ├── schema.sql            # All table definitions
    │   └── init.js               # DB setup script
    ├── src/
    │   ├── config/env.js         # Zod-validated env vars
    │   ├── controllers/          # Thin req/res handlers
    │   ├── lib/
    │   │   ├── db.js             # MySQL connection pool
    │   │   ├── jwt.js            # Sign and verify tokens
    │   │   └── email.js          # Nodemailer transporter
    │   ├── middleware/           # Auth, error, validate
    │   ├── routes/               # Express routers
    │   ├── schemas/              # Zod request schemas
    │   ├── services/             # Business logic
    │   ├── app.js                # Express app setup
    │   └── index.js              # Server entry point
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL 8

### 1. Clone the repo

```bash
git clone https://github.com/your-username/job-trackly.git
cd "job-trackly"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp src/.env.example src/.env
```

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=Job_Trackly

# JWT
JWT_SECRET=your_super_secret_key_min_16_chars
JWT_EXPIRES_IN=7d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email / SMTP (Gmail App Password recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=Job Trackly <your_gmail@gmail.com>
```

Create the database and all tables:

```bash
npm run db:init
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:4000`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Database Schema

```
users               — accounts, profile, social links
applications        — job applications per user
timeline_events     — status change history per application
contacts            — recruiter contacts per application
resumes             — resume file references
email_otps          — temporary OTP codes for signup verification
```

### Useful DB commands

```bash
# Create all tables (safe, skips existing)
npm run db:init

# Drop all tables and recreate (dev only)
npm run db:reset
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/send-otp` | — | Send OTP to email |
| POST | `/api/auth/signup` | — | Create account (requires OTP) |
| POST | `/api/auth/signin` | — | Sign in with email + password |
| POST | `/api/auth/signout` | — | Sign out |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/auth/google` | — | Start Google OAuth |
| GET | `/api/auth/google/callback` | — | Google OAuth callback |

### Applications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/applications` | ✓ | List all applications |
| GET | `/api/applications/stats` | ✓ | Get status counts |
| GET | `/api/applications/:id` | ✓ | Get one application |
| POST | `/api/applications` | ✓ | Create application |
| PATCH | `/api/applications/:id` | ✓ | Update application |
| DELETE | `/api/applications/:id` | ✓ | Delete application |

### User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/api/users/me/password` | ✓ | Change password |
| PUT | `/api/users/me/profile` | ✓ | Update profile |

---

## Sign Up Flow (OTP)

```
1. User fills registration form
2. Frontend sends POST /api/auth/send-otp { email }
3. Backend generates 6-digit OTP, bcrypt-hashes it, saves to email_otps
4. Nodemailer sends OTP email (expires in 10 minutes)
5. User enters OTP on Step 2 screen
6. Frontend sends POST /api/auth/signup { ...form, otp }
7. Backend verifies OTP hash → creates user → deletes OTP row → issues JWT
8. User is redirected to /dashboard
```

---

## Google OAuth Flow

```
1. User clicks "Continue with Google"
2. Frontend redirects to GET /api/auth/google
3. Passport redirects to Google consent screen
4. User approves → Google calls GET /api/auth/google/callback
5. Passport verifies → googleAuth() upserts user in DB → issues JWT
6. Backend redirects to /auth/callback?token=...&user=...
7. AuthCallbackPage reads params → stores in localStorage + Zustand
8. User is redirected to /dashboard
```

### Google Console setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorised JavaScript origins:
   ```
   http://localhost:4000
   http://localhost:5173
   ```
5. Authorised redirect URIs:
   ```
   http://localhost:4000/api/auth/google/callback
   ```
6. Copy Client ID and Client Secret to your `.env`

---

## Gmail App Password setup

Required for sending OTP emails via Gmail:

1. Enable 2-Step Verification on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Copy the 16-character password (no spaces) to `SMTP_PASS` in your `.env`

---

## Environment Variables Reference

### Backend (`backend/src/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | — | `4000` | Server port |
| `NODE_ENV` | — | `development` | Environment |
| `DB_HOST` | ✓ | — | MySQL host |
| `DB_PORT` | — | `3306` | MySQL port |
| `DB_USER` | ✓ | — | MySQL user |
| `DB_PASSWORD` | ✓ | — | MySQL password |
| `DB_NAME` | ✓ | — | Database name |
| `JWT_SECRET` | ✓ | — | Min 16 chars |
| `JWT_EXPIRES_IN` | — | `7d` | Token lifetime |
| `CLIENT_URL` | — | `http://localhost:5173` | Frontend URL |
| `GOOGLE_CLIENT_ID` | ✓ | — | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | ✓ | — | Google OAuth |
| `SMTP_HOST` | ✓ | `smtp.gmail.com` | Email host |
| `SMTP_PORT` | — | `587` | Email port |
| `SMTP_USER` | ✓ | — | Email address |
| `SMTP_PASS` | ✓ | — | App password |
| `SMTP_FROM` | — | — | From address |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | — | `http://localhost:4000/api` | Backend URL |

---

## Scripts

### Backend
```bash
npm run dev        # Start with --watch (auto-restart)
npm start          # Start production server
npm run db:init    # Create database and tables
npm run db:reset   # Drop all tables and recreate (dev only)
```

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## License

MIT