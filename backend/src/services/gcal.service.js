import { google } from 'googleapis'
import pool from '../lib/db.js'
import { ENV } from '../config/env.js'

function makeOAuth2Client() {
  return new google.auth.OAuth2(
    ENV.GOOGLE_CLIENT_ID,
    ENV.GOOGLE_CLIENT_SECRET,
    ENV.GOOGLE_CALENDAR_REDIRECT_URI,
  )
}

async function getAuthedClient(userId) {
  const [rows] = await pool.query(
    `SELECT gcal_refresh_token FROM users WHERE id = ?`, [userId]
  )
  const refreshToken = rows[0]?.gcal_refresh_token
  if (!refreshToken) throw new Error('Google Calendar not connected')

  const auth = makeOAuth2Client()
  auth.setCredentials({ refresh_token: refreshToken })
  return auth
}

export function getAuthUrl(userId) {
  const auth = makeOAuth2Client()
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt:      'consent',
    scope:       ['https://www.googleapis.com/auth/calendar.events'],
    state:       String(userId),
  })
}

export async function handleOAuthCallback(code, userId) {
  const auth = makeOAuth2Client()
  const { tokens } = await auth.getToken(code)

  if (!tokens.refresh_token) {
    throw new Error('No refresh_token returned — revoke app access in your Google Account and reconnect')
  }

  await pool.query(
    `UPDATE users SET gcal_refresh_token = ?, gcal_connected = 1 WHERE id = ?`,
    [tokens.refresh_token, userId]
  )
}

export async function disconnectCalendar(userId) {
  const [rows] = await pool.query(
    `SELECT gcal_refresh_token FROM users WHERE id = ?`, [userId]
  )
  const token = rows[0]?.gcal_refresh_token
  if (token) {
    try {
      const auth = makeOAuth2Client()
      await auth.revokeToken(token)
    } catch { /* ignore revoke errors */ }
  }
  await pool.query(
    `UPDATE users SET gcal_refresh_token = NULL, gcal_connected = 0 WHERE id = ?`, [userId]
  )
}

export async function getConnectionStatus(userId) {
  const [rows] = await pool.query(
    `SELECT gcal_connected FROM users WHERE id = ?`, [userId]
  )
  return { connected: Boolean(rows[0]?.gcal_connected) }
}

async function createGCalEvent(userId, { summary, description, date, colorId }) {
  const auth     = await getAuthedClient(userId)
  const calendar = google.calendar({ version: 'v3', auth })


  const res = await calendar.events.insert({
    calendarId: 'primary',
    resource: {
      summary,
      description,
      colorId: colorId ?? '9',
      start: { date },
      end:   { date },
      reminders: {
        useDefault: false,
        overrides:  [{ method: 'popup', minutes: 9 * 60 }],
      },
    },
  })

  return res.data.id
}

async function deleteGCalEvent(userId, gcalEventId) {
  try {
    const auth     = await getAuthedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth })
    await calendar.events.delete({ calendarId: 'primary', eventId: gcalEventId })
  } catch (err) {
    if (err?.status !== 404 && err?.code !== 404) throw err
  }
}

const EVENT_CONFIG = {
  Applied:   { summary: (c, r) => `Applied: ${c} — ${r}`,          colorId: '9',  desc: (c, r) => `Job application submitted to ${c} for ${r}.` },
  FollowUp:  { summary: (c, r) => `Follow up: ${c} — ${r}`,        colorId: '5',  desc: (c, r) => `Time to follow up on your application to ${c} for ${r}.` },
  Interview: { summary: (c, r) => `Interview: ${c} — ${r}`,        colorId: '2',  desc: (c, r) => `Interview scheduled with ${c} for ${r}.` },
  Offer:     { summary: (c, r) => `🎉 Offer received: ${c} — ${r}`, colorId: '10', desc: (c, r) => `You received an offer from ${c} for ${r}!` },
}

export async function pushEvent(userId, applicationId, eventType, dateStr) {
  if (!dateStr) return null

  const [existing] = await pool.query(
    `SELECT gcal_event_id FROM gcal_events WHERE application_id = ? AND event_type = ?`,
    [applicationId, eventType]
  )
  if (existing[0]) return existing[0].gcal_event_id

  const [apps] = await pool.query(
    `SELECT company, role FROM applications WHERE id = ? AND user_id = ?`,
    [applicationId, userId]
  )
  if (!apps[0]) return null

  const { company, role } = apps[0]
  const cfg = EVENT_CONFIG[eventType]
  if (!cfg) return null

  const gcalEventId = await createGCalEvent(userId, {
    summary:     cfg.summary(company, role),
    description: cfg.desc(company, role),
    date:        dateStr,
    colorId:     cfg.colorId,
  })

  await pool.query(
    `INSERT INTO gcal_events (user_id, application_id, event_type, gcal_event_id) VALUES (?, ?, ?, ?)`,
    [userId, applicationId, eventType, gcalEventId]
  )

  return gcalEventId
}

export async function deleteEvent(userId, applicationId, eventType) {
  const [rows] = await pool.query(
    `SELECT gcal_event_id FROM gcal_events WHERE application_id = ? AND event_type = ?`,
    [applicationId, eventType]
  )
  if (!rows[0]) return

  await deleteGCalEvent(userId, rows[0].gcal_event_id)
  await pool.query(
    `DELETE FROM gcal_events WHERE application_id = ? AND event_type = ?`,
    [applicationId, eventType]
  )
}

// Safely convert any date value from MySQL to YYYY-MM-DD string
function toDateStr(val) {
  if (!val) return null
  const d = new Date(val)
  if (isNaN(d.getTime())) return null
  // Use UTC to avoid timezone shifting the date
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function syncAll(userId) {
  const [apps] = await pool.query(
    `SELECT id, status, date_applied, updated_at FROM applications
     WHERE user_id = ? AND status NOT IN ('Saved','Rejected')`,
    [userId]
  )

  const results = { pushed: 0, skipped: 0, failed: 0 }

  for (const app of apps) {
    const dateApplied = toDateStr(app.date_applied)
    const dateUpdated = toDateStr(app.updated_at)

    const toTry = []

    if (dateApplied) {
      toTry.push(['Applied', dateApplied])

      if (app.status === 'Applied') {
        const fu = new Date(dateApplied)
        fu.setDate(fu.getDate() + 7)
        toTry.push(['FollowUp', fu.toISOString().slice(0, 10)])
      }
    }

    if (app.status === 'Interview' && dateUpdated) toTry.push(['Interview', dateUpdated])
    if (app.status === 'Offer'     && dateUpdated) toTry.push(['Offer',     dateUpdated])

    for (const [type, date] of toTry) {
      try {
        const r = await pushEvent(userId, app.id, type, date)
        r ? results.pushed++ : results.skipped++
      } catch (err) {
        results.failed++
        console.error(`[gcal] Failed to push ${type} for app ${app.id}:`, err.message)
      }
    }
  }

  return results
}

export async function getSyncedEvents(userId) {
  const [rows] = await pool.query(
    `SELECT application_id, event_type, gcal_event_id FROM gcal_events WHERE user_id = ?`,
    [userId]
  )
  return rows
}