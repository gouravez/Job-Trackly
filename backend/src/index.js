// backend/src/index.js
import 'dotenv/config'
import app from './app.js'
import { ENV } from './config/env.js'
import { testConnection } from './lib/db.js'
import { runFollowUpReminders } from './jobs/followUpReminder.js'   // ← NEW

async function start() {
  await testConnection()

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`)
    console.log(`   Environment : ${ENV.NODE_ENV}`)
    console.log(`   CORS origin : ${ENV.CLIENT_URL}`)
  })

  scheduleReminders()  // ← NEW
}

// ── Daily reminder scheduler ───────────────────────────────────────────────
// Fires once 10 seconds after boot (so the DB is fully ready), then every
// 24 hours. Each user's individual frequency (daily / weekly) is enforced
// inside the job via last_reminded_at — so running this daily is safe.

function scheduleReminders() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000

  async function run() {
    try {
      await runFollowUpReminders()
    } catch (err) {
      console.error('[reminder] Uncaught error in scheduler:', err)
    }
    setTimeout(run, MS_PER_DAY)
  }

  setTimeout(run, 10_000)
  console.log('⏰  Reminder scheduler armed (first run in 10 s, then every 24 h)')
}

start()