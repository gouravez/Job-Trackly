# Job Trackly — Frontend

> Job application tracker built with React + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

## Directory Structure

```
Job Trackly/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                 # Primitive, reusable UI atoms
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Logo.jsx
│   │   │   └── AvatarStack.jsx
│   │   ├── auth/               # Auth-specific components
│   │   │   └── SocialAuthButtons.jsx
│   │   └── layout/             # Page-level layout wrappers
│   │       ├── AuthLayout.jsx
│   │       └── Navbar.jsx
│   │
│   ├── pages/                  # Route-level page components
│   │   ├── LandingPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── SignInPage.jsx
│   │
│   ├── hooks/                  # Custom React hooks (e.g. useAuth, useForm)
│   ├── lib/
│   │   └── utils.js            # Shared utilities (cn, formatters, etc.)
│   ├── services/
│   │   └── api.js              # Axios instance + all API calls
│   ├── store/
│   │   └── authStore.js        # Zustand global state
│   └── utils/                  # Pure helper functions
│
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Adding a Backend

1. Copy `.env.example` → `.env` and set `VITE_API_URL`.
2. All API calls live in `src/services/api.js` — add new endpoint methods there.
3. Auth state (user, token) is in `src/store/authStore.js` (Zustand).
4. Swap the `TODO` comments in `SignUpPage` / `SignInPage` with real `authService` calls.

## Environment Variables

| Variable       | Default                     | Description          |
| -------------- | --------------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:4000/api` | Backend API base URL |
