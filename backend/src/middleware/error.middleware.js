import { ENV } from '../config/env.js'

// ---------------------------------------------------------------------------
// Global error handler — catches anything thrown inside controllers/services.
// Always returns a consistent shape: { success, message, ...(stack in dev) }
// ---------------------------------------------------------------------------

export function errorHandler(err, _req, res, _next) {
  console.error(err)

  const status  = err.status  || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

// Convenience — throw these from services/controllers
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.status = status
  }
}