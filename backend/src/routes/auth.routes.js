import { Router } from 'express'
import { validate }  from '../middleware/validate.middleware.js'
import { protect }   from '../middleware/auth.middleware.js'
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

router.post('/send-otp', validate(sendOtpSchema), async (req, res, next) => {
  try {
    const result = await sendOtp(req.body.email)
    res.json({ success: true, ...result })
  } catch (err) { next(err) }
})

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/signup',  validate(signupSchema),  signupController)
router.post('/signin',  validate(signinSchema),  signinController)
router.post('/signout', signoutController)

// Protected
router.get('/me', protect, getMeController)

// ── Password reset ────────────────────────────────────────────────────────────
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController)
router.post('/reset-password',  validate(resetPasswordSchema),  resetPasswordController)

export default router