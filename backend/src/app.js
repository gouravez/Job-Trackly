// backend/src/app.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import passport from 'passport'
import { ENV } from './config/env.js'
import authRoutes        from './routes/auth.routes.js'
import googleRoutes      from './routes/google.routes.js'
import applicationRoutes from './routes/application.routes.js'
import userRoutes        from './routes/user.routes.js'
import reminderRoutes    from './routes/reminder.routes.js' 
import calendarRoutes from './routes/calendar.routes.js' 
import { errorHandler } from './middleware/error.middleware.js'

const app = express()

// ── Security & utility middleware ──────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    // Allow the frontend and any Chrome extension
    if (
      origin === ENV.CLIENT_URL ||
      /^chrome-extension:\/\//.test(origin)
    ) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'))
app.use(passport.initialize())

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/auth',         googleRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/users/me',     userRoutes)
app.use('/api/reminders',    reminderRoutes)   
app.use('/api/calendar', calendarRoutes) 

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler — must be last
app.use(errorHandler)

export default app