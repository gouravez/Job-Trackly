import { randomBytes } from 'crypto'
import { ENV } from '../config/env.js'
import { storeCode, consumeCode } from '../lib/oauthCodes.js'
import { AppError } from '../middleware/error.middleware.js'

// ---------------------------------------------------------------------------
// Step 1 — Google calls us back after the user consents.
// We no longer put the JWT in the redirect URL. Instead:
//   1. Generate a random 32-byte hex code (one-time, 60 s TTL).
//   2. Store { token, user } against that code in MySQL.
//   3. Redirect to /auth/callback?code=<code> — opaque, not a JWT.
// ---------------------------------------------------------------------------
export async function googleCallback(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect(`${ENV.CLIENT_URL}/signin?error=google`)
    }

    const { token, user } = req.user
    const code = randomBytes(32).toString('hex')
    await storeCode(code, { token, user })

    res.redirect(`${ENV.CLIENT_URL}/auth/callback?code=${code}`)
  } catch (err) {
    next(err)
  }
}

// ---------------------------------------------------------------------------
// Step 2 — Frontend POSTs the code here to exchange it for the real JWT.
// POST /api/auth/google/token  { code: string }
// Returns { success: true, data: { token, user } }
// ---------------------------------------------------------------------------
export async function exchangeCode(req, res, next) {
  try {
    const { code } = req.body
    if (!code || typeof code !== 'string') {
      throw new AppError('Missing code', 400)
    }

    const payload = await consumeCode(code)
    if (!payload) {
      throw new AppError('Invalid or expired code', 401)
    }

    res.json({ success: true, data: payload })
  } catch (err) {
    next(err)
  }
}