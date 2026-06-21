import { ENV } from '../config/env.js'
import {
  getAuthUrl,
  handleOAuthCallback,
  disconnectCalendar,
  getConnectionStatus,
  pushEvent,
  deleteEvent,
  syncAll,
  getSyncedEvents,
} from '../services/googleCalendar.service.js'

// Not protected — Google redirects here directly, before any JWT exists.
export async function oauthCallback(req, res) {
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
}

export function oauthUrl(req, res) {
  const url = getAuthUrl(req.user.userId)
  res.json({ success: true, data: { url } })
}

export async function status(req, res, next) {
  try {
    const status = await getConnectionStatus(req.user.userId)
    const synced = await getSyncedEvents(req.user.userId)
    res.json({ success: true, data: { ...status, syncedCount: synced.length, synced } })
  } catch (err) { next(err) }
}

export async function disconnect(req, res, next) {
  try {
    await disconnectCalendar(req.user.userId)
    res.json({ success: true, message: 'Google Calendar disconnected' })
  } catch (err) { next(err) }
}

export async function syncAllEvents(req, res, next) {
  try {
    const results = await syncAll(req.user.userId)
    res.json({ success: true, data: results })
  } catch (err) { next(err) }
}

export async function createEvent(req, res, next) {
  try {
    const { applicationId, eventType, date } = req.body
    const gcalEventId = await pushEvent(req.user.userId, applicationId, eventType, date)
    res.json({ success: true, data: { gcalEventId } })
  } catch (err) { next(err) }
}

export async function removeEvent(req, res, next) {
  try {
    const { applicationId, eventType } = req.body
    await deleteEvent(req.user.userId, applicationId, eventType)
    res.json({ success: true })
  } catch (err) { next(err) }
}