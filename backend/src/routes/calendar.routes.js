import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createEventSchema, deleteEventSchema } from '../schemas/calendar.schema.js'
import {
  oauthCallback,
  oauthUrl,
  status,
  disconnect,
  syncAllEvents,
  createEvent,
  removeEvent,
} from '../controllers/calendar.controller.js'

const router = Router()

router.get('/oauth/callback', oauthCallback)

router.use(protect)

router.get('/oauth/url',     oauthUrl)
router.get('/status',        status)
router.delete('/disconnect', disconnect)
router.post('/sync-all',     syncAllEvents)
router.post('/events',       validate(createEventSchema), createEvent)
router.delete('/events',     validate(deleteEventSchema), removeEvent)

export default router