import pool from '../lib/db.js'
import { AppError } from '../middleware/error.middleware.js'
import { sendFollowUpReminderEmail } from '../lib/email.js'

export async function getSettings(userId) {
  const [rows] = await pool.query(
    `SELECT reminder_enabled, reminder_days, reminder_frequency
     FROM   users
     WHERE  id = ?`,
    [userId]
  )
  if (!rows[0]) throw new AppError('User not found', 404)

  return {
    reminderEnabled:   Boolean(rows[0].reminder_enabled),
    reminderDays:      rows[0].reminder_days      ?? 7,
    reminderFrequency: rows[0].reminder_frequency ?? 'weekly',
  }
}

export async function updateSettings(userId, { reminderEnabled, reminderDays, reminderFrequency }) {
  await pool.query(
    `UPDATE users
     SET reminder_enabled   = ?,
         reminder_days      = ?,
         reminder_frequency = ?
     WHERE id = ?`,
    [reminderEnabled ? 1 : 0, reminderDays, reminderFrequency, userId]
  )
}

export async function sendTestReminder(userId) {
  const [users] = await pool.query(
    `SELECT first_name, email FROM users WHERE id = ?`,
    [userId]
  )
  if (!users[0]) throw new AppError('User not found', 404)

  const [apps] = await pool.query(
    `SELECT company, role, status,
            DATEDIFF(NOW(), COALESCE(date_applied, created_at)) AS days_since
     FROM   applications
     WHERE  user_id = ?
       AND  status IN ('Applied', 'Assessment')
     ORDER  BY days_since DESC
     LIMIT  5`,
    [userId]
  )

  if (apps.length === 0) {
    return { sent: false, message: 'No Applied or Assessment applications found to preview.' }
  }

  const payload = apps.map((a) => ({
    company:   a.company,
    role:      a.role,
    status:    a.status,
    daysSince: Number(a.days_since),
  }))

  await sendFollowUpReminderEmail(users[0].email, users[0].first_name, payload)

  return { sent: true, email: users[0].email }
}