import { verifyToken } from '../lib/jwt.js'
import { AppError } from './error.middleware.js'
import pool from '../lib/db.js'

export async function protect(req, _res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token   = header.split(' ')[1]
    const payload = verifyToken(token)

    // Confirm the user still exists — catches stale tokens after a db reset/reseed
    const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [payload.userId])
    if (!rows[0]) {
      throw new AppError('Session expired — please sign in again', 401)
    }

    req.user = { userId: payload.userId, email: payload.email }
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401))
    }
    next(err)
  }
}