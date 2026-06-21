import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createReferralSchema, updateReferralSchema } from '../schemas/referral.schema.js'
import {
  listReferrals,
  getReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  linkApplication,
  unlinkApplication,
} from '../controllers/referral.controller.js'

const router = Router()
router.use(protect)

router.get('/',      listReferrals)
router.get('/:id',   getReferral)
router.post('/',     validate(createReferralSchema), createReferral)
router.patch('/:id', validate(updateReferralSchema), updateReferral)
router.delete('/:id', deleteReferral)

router.post('/:id/link',           linkApplication)
router.delete('/:id/link/:appId',  unlinkApplication)

export default router