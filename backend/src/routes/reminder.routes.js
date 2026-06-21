import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { updateReminderSettingsSchema } from '../schemas/reminder.schema.js'
import {
  getSettings,
  updateSettings,
  sendTestReminder,
} from '../controllers/reminder.controller.js'

const router = Router()
router.use(protect)

// GET  /api/reminders/settings — the signed-in user's reminder preferences
// PUT  /api/reminders/settings — save reminder preferences
// POST /api/reminders/test     — send a live preview email immediately

router.get('/settings', getSettings)
router.put('/settings', validate(updateReminderSettingsSchema), updateSettings)
router.post('/test',    sendTestReminder)

export default router