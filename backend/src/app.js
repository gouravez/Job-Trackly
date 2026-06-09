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
import { errorHandler } from './middleware/error.middleware.js'

const app = express()

// ── Security & utility middleware ──────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
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

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler — must be last
app.use(errorHandler)

export default app
