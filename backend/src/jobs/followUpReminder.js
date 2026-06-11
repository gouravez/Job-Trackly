// backend/src/jobs/followUpReminder.js
// ---------------------------------------------------------------------------
// Scheduled job — wired into index.js via a daily setInterval.
// Finds every user with reminders enabled whose applications haven't moved
// in `reminder_days` days and sends them a follow-up nudge email.
// Each user's `reminder_frequency` (daily / weekly) is enforced via the
// `last_reminded_at` column so we never over-email.
// ---------------------------------------------------------------------------

import pool from '../lib/db.js'
import { sendFollowUpReminderEmail } from '../lib/email.js'

export async function runFollowUpReminders() {
  console.log('[reminder] Running follow-up reminder job...')

  // ── 1. Fetch users who are due for a reminder ─────────────────────────────
  // Respects frequency: daily users get one per day, weekly get one per week.
  const [users] = await pool.query(`
    SELECT id, first_name, email, reminder_days, reminder_frequency
    FROM   users
    WHERE  reminder_enabled = 1
      AND (
        last_reminded_at IS NULL
        OR (reminder_frequency = 'daily'  AND last_reminded_at < NOW() - INTERVAL 1 DAY)
        OR (reminder_frequency = 'weekly' AND last_reminded_at < NOW() - INTERVAL 7 DAY)
      )
  `)

  if (users.length === 0) {
    console.log('[reminder] No users due for a reminder.')
    return
  }

  let sent   = 0
  let failed = 0

  // ── 2. Per user — find stale applications ─────────────────────────────────
  for (const user of users) {
    const [apps] = await pool.query(`
      SELECT company, role, status,
             DATEDIFF(NOW(), COALESCE(date_applied, created_at)) AS days_since
      FROM   applications
      WHERE  user_id = ?
        AND  status IN ('Applied', 'Assessment')
        AND  DATEDIFF(NOW(), COALESCE(date_applied, created_at)) >= ?
      ORDER  BY days_since DESC
      LIMIT  10
    `, [user.id, user.reminder_days])

    if (apps.length === 0) continue   // nothing stale for this user — skip

    const payload = apps.map((a) => ({
      company:   a.company,
      role:      a.role,
      status:    a.status,
      daysSince: Number(a.days_since),
    }))

    try {
      await sendFollowUpReminderEmail(user.email, user.first_name, payload)

      // Stamp last_reminded_at so we don't re-email until next cycle
      await pool.query(
        `UPDATE users SET last_reminded_at = NOW() WHERE id = ?`,
        [user.id]
      )

      sent++
      console.log(`[reminder] ✓ Sent to ${user.email} (${apps.length} apps)`)
    } catch (err) {
      failed++
      console.error(`[reminder] ✗ Failed for ${user.email}:`, err.message)
    }
  }

  console.log(`[reminder] Done — sent: ${sent}, failed: ${failed}, skipped: ${users.length - sent - failed}`)
}