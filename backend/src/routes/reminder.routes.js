// backend/src/routes/reminder.routes.js
import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import pool from '../lib/db.js'
import { sendFollowUpReminderEmail } from '../lib/email.js'

const router = Router()
router.use(protect)

// ── GET /api/reminders/settings ──────────────────────────────────────────────
// Returns the signed-in user's reminder preferences.

router.get('/settings', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT reminder_enabled, reminder_days, reminder_frequency
       FROM   users
       WHERE  id = ?`,
      [req.user.userId]
    )
    if (!rows[0]) return res.status(404).json({ success: false, message: 'User not found' })

    res.json({
      success: true,
      data: {
        reminderEnabled:   Boolean(rows[0].reminder_enabled),
        reminderDays:      rows[0].reminder_days      ?? 7,
        reminderFrequency: rows[0].reminder_frequency ?? 'weekly',
      },
    })
  } catch (err) { next(err) }
})

// ── PUT /api/reminders/settings ──────────────────────────────────────────────
// Saves the user's reminder preferences.

router.put('/settings', async (req, res, next) => {
  try {
    const { reminderEnabled, reminderDays, reminderFrequency } = req.body

    const days = Number(reminderDays)
    if (!Number.isInteger(days) || days < 1 || days > 90) {
      return res.status(422).json({ success: false, message: 'reminderDays must be between 1 and 90' })
    }
    if (!['daily', 'weekly'].includes(reminderFrequency)) {
      return res.status(422).json({ success: false, message: 'reminderFrequency must be "daily" or "weekly"' })
    }

    await pool.query(
      `UPDATE users
       SET reminder_enabled   = ?,
           reminder_days      = ?,
           reminder_frequency = ?
       WHERE id = ?`,
      [reminderEnabled ? 1 : 0, days, reminderFrequency, req.user.userId]
    )

    res.json({ success: true, message: 'Reminder settings saved' })
  } catch (err) { next(err) }
})

// ── POST /api/reminders/test ─────────────────────────────────────────────────
// Sends a live preview email immediately so the user can see what they'll get.

router.post('/test', async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT first_name, email FROM users WHERE id = ?`,
      [req.user.userId]
    )
    if (!users[0]) return res.status(404).json({ success: false, message: 'User not found' })

    const [apps] = await pool.query(
      `SELECT company, role, status,
              DATEDIFF(NOW(), COALESCE(date_applied, created_at)) AS days_since
       FROM   applications
       WHERE  user_id = ?
         AND  status IN ('Applied', 'Assessment')
       ORDER  BY days_since DESC
       LIMIT  5`,
      [req.user.userId]
    )

    if (apps.length === 0) {
      return res.json({
        success: false,
        message: 'No Applied or Assessment applications found to preview.',
      })
    }

    const payload = apps.map((a) => ({
      company:   a.company,
      role:      a.role,
      status:    a.status,
      daysSince: Number(a.days_since),
    }))

    await sendFollowUpReminderEmail(users[0].email, users[0].first_name, payload)

    res.json({ success: true, message: `Test email sent to ${users[0].email}` })
  } catch (err) { next(err) }
})

export default router