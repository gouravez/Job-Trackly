import { AppError } from './error.middleware.js'

// ---------------------------------------------------------------------------
// Zod request validator.
// Usage: router.post('/signup', validate(signupSchema), controller)
// ---------------------------------------------------------------------------

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      return next(new AppError(message, 422))
    }
    req.body = result.data   // replace body with parsed+coerced data
    next()
  }
}