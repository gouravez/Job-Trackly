// backend/src/routes/referral.routes.js
import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { z } from 'zod'
import * as svc from '../services/referral.service.js'

const router = Router()
router.use(protect)

const referralSchema = z.object({
  name:          z.string().min(1, 'Name is required').max(255),
  email:         z.string().email().optional().or(z.literal('')),
  phone:         z.string().max(50).optional().or(z.literal('')),
  title:         z.string().max(255).optional().or(z.literal('')),
  company:       z.string().max(255).optional().or(z.literal('')),
  linkedin:      z.string().max(255).optional().or(z.literal('')),
  relationship:  z.enum(['Colleague','Friend','Alumni','Recruiter','Manager','Mentor','Other']).default('Other'),
  strength:      z.coerce.number().int().min(1).max(5).default(3),
  notes:         z.string().optional().or(z.literal('')),
  last_contacted: z.string().optional().or(z.literal('')),
  applicationIds: z.array(z.number().int()).optional(),
})

const updateSchema = referralSchema.partial()

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.get('/',      async (req, res, next) => {
  try { res.json({ success: true, data: await svc.getAll(req.user.userId) }) }
  catch (e) { next(e) }
})

router.get('/:id',   async (req, res, next) => {
  try { res.json({ success: true, data: await svc.getOne(req.user.userId, req.params.id) }) }
  catch (e) { next(e) }
})

router.post('/', validate(referralSchema), async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await svc.create(req.user.userId, req.body) }) }
  catch (e) { next(e) }
})

router.patch('/:id', validate(updateSchema), async (req, res, next) => {
  try { res.json({ success: true, data: await svc.update(req.user.userId, req.params.id, req.body) }) }
  catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try { await svc.remove(req.user.userId, req.params.id); res.json({ success: true }) }
  catch (e) { next(e) }
})

// ── Link / unlink a referral to an application ────────────────────────────────
router.post('/:id/link',   async (req, res, next) => {
  try {
    await svc.linkApplication(req.user.userId, req.params.id, req.body.applicationId, req.body.referredAt)
    res.json({ success: true })
  } catch (e) { next(e) }
})

router.delete('/:id/link/:appId', async (req, res, next) => {
  try {
    await svc.unlinkApplication(req.user.userId, req.params.id, req.params.appId)
    res.json({ success: true })
  } catch (e) { next(e) }
})

export default router