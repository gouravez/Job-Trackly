import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { changePassword, updateProfile } from '../services/user.service.js'
import { z } from 'zod'

const router = Router()

// All routes require auth
router.use(protect)

// ── Change password ───────────────────────────────────────────────────────────
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
})

router.put('/password', async (req, res, next) => {
  try {
    const parsed = passwordSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        message: parsed.error.errors[0].message,
      })
    }
    await changePassword(req.user.userId, parsed.data)
    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) { next(err) }
})

// ── Update profile ────────────────────────────────────────────────────────────
router.put('/profile', async (req, res, next) => {
  try {
    await updateProfile(req.user.userId, req.body)
    res.json({ success: true, message: 'Profile updated successfully' })
  } catch (err) { next(err) }
})

export default router