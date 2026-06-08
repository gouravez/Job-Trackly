import { verifyToken } from '../lib/jwt.js'
import { AppError } from './error.middleware.js'

// ---------------------------------------------------------------------------
// Attach req.user = { userId, email } on every protected route.
// Usage: router.get('/me', protect, controller)
// ---------------------------------------------------------------------------

export function protect(req, _res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token   = header.split(' ')[1]
    const payload = verifyToken(token)
    req.user      = { userId: payload.userId, email: payload.email }
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401))
    }
    next(err)
  }
}