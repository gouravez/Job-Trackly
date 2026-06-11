import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { ENV } from '../config/env.js'
import {
  getAuthUrl, handleOAuthCallback, disconnectCalendar,
  getConnectionStatus, pushEvent, deleteEvent, syncAll, getSyncedEvents,
} from '../services/gcal.service.js'

const router = Router()

// ── OAuth callback — NOT protected (no JWT at this point) ─────────────────
router.get('/oauth/callback', async (req, res) => {
  const { code, state: userId, error } = req.query

  if (error || !code || !userId) {
    return res.redirect(`${ENV.CLIENT_URL}/calendar?gcal=error`)
  }

  try {
    await handleOAuthCallback(code, Number(userId))
    res.redirect(`${ENV.CLIENT_URL}/calendar?gcal=connected`)
  } catch (err) {
    console.error('[gcal] OAuth callback error:', err.message)
    res.redirect(`${ENV.CLIENT_URL}/calendar?gcal=error`)
  }
})

// ── All routes below require auth ─────────────────────────────────────────
router.use(protect)

router.get('/oauth/url', (req, res) => {
  const url = getAuthUrl(req.user.userId)
  res.json({ success: true, data: { url } })
})

router.get('/status', async (req, res, next) => {
  try {
    const status = await getConnectionStatus(req.user.userId)
    const synced = await getSyncedEvents(req.user.userId)
    res.json({ success: true, data: { ...status, syncedCount: synced.length, synced } })
  } catch (err) { next(err) }
})

router.delete('/disconnect', async (req, res, next) => {
  try {
    await disconnectCalendar(req.user.userId)
    res.json({ success: true, message: 'Google Calendar disconnected' })
  } catch (err) { next(err) }
})

router.post('/sync-all', async (req, res, next) => {
  try {
    const results = await syncAll(req.user.userId)
    res.json({ success: true, data: results })
  } catch (err) { next(err) }
})

router.post('/events', async (req, res, next) => {
  try {
    const { applicationId, eventType, date } = req.body
    if (!applicationId || !eventType || !date) {
      return res.status(422).json({ success: false, message: 'applicationId, eventType, and date are required' })
    }
    const gcalEventId = await pushEvent(req.user.userId, Number(applicationId), eventType, date)
    res.json({ success: true, data: { gcalEventId } })
  } catch (err) { next(err) }
})

router.delete('/events', async (req, res, next) => {
  try {
    const { applicationId, eventType } = req.body
    await deleteEvent(req.user.userId, Number(applicationId), eventType)
    res.json({ success: true })
  } catch (err) { next(err) }
})

export default router