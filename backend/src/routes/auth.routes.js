import { Router } from 'express'
import { validate }  from '../middleware/validate.middleware.js'
import { protect }   from '../middleware/auth.middleware.js'
import { otpLimiter, signinLimiter, resetLimiter } from '../middleware/rateLimiter.middleware.js'
import { signupSchema, signinSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js'
import { z } from 'zod'
import {
  signupController,
  signinController,
  getMeController,
  signoutController,
  forgotPasswordController,
  resetPasswordController,
} from '../controllers/auth.controller.js'
import { sendOtp } from '../services/otp.service.js'

const router = Router()

// ── OTP ───────────────────────────────────────────────────────────────────────
const sendOtpSchema = z.object({ email: z.string().email() })

// otpLimiter: 5 req / 15 min — prevents using this endpoint to spam emails
router.post('/send-otp', otpLimiter, validate(sendOtpSchema), async (req, res, next) => {
  try {
    const result = await sendOtp(req.body.email)
    res.json({ success: true, ...result })
  } catch (err) { next(err) }
})

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/signup',  validate(signupSchema),  signupController)

// signinLimiter: 10 req / 15 min — brute-force protection
router.post('/signin',  signinLimiter, validate(signinSchema),  signinController)

router.post('/signout', signoutController)

// Protected
router.get('/me', protect, getMeController)

// ── Password reset ────────────────────────────────────────────────────────────
// otpLimiter: same 5 req / 15 min as send-otp — prevents email spam
router.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), forgotPasswordController)

// resetLimiter: 5 req / 15 min — OTP already expires but cap submissions too
router.post('/reset-password',  resetLimiter, validate(resetPasswordSchema),  resetPasswordController)

export default router