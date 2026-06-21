import 'dotenv/config'
import { readFileSync } from 'fs'
import { createConnection } from 'mysql2/promise'
import { ENV } from '../src/config/env.js'

// ---------------------------------------------------------------------------
// Creates the database and all tables from schema.sql.
// The database name is always read from DB_NAME in your .env file.
//
// Usage:
//   npm run db:init   — create tables (safe, skips existing)
//   npm run db:reset  — DROP all tables then recreate (dev only)
// ---------------------------------------------------------------------------

const RESET = process.argv.includes('--reset')
const DB    = ENV.DB_NAME

// Full drop order — children before parents so FK constraints don't block.
// Must include every table defined in schema.sql.
const TABLES = [
  'oauth_codes',
  'gcal_events',
  'referral_applications',
  'referrals',
  'resumes',
  'contacts',
  'timeline_events',
  'applications',
  'email_otps',
  'users',
]

async function init() {
  const conn = await createConnection({
    host:               ENV.DB_HOST,
    port:               Number(ENV.DB_PORT),
    user:               ENV.DB_USER,
    password:           ENV.DB_PASSWORD,
    multipleStatements: true,
  })

  // ── Optional reset (dev only) ─────────────────────────────────────────────
  if (RESET) {
    if (ENV.NODE_ENV === 'production') {
      console.error('❌ db:reset is not allowed in production.')
      await conn.end()
      process.exit(1)
    }

    console.log(`\n⚠️  Resetting — dropping all tables in \`${DB}\`...`)
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
    await conn.query(`USE \`${DB}\`;`)
    await conn.query('SET FOREIGN_KEY_CHECKS = 0;')

    for (const table of TABLES) {
      await conn.query(`DROP TABLE IF EXISTS \`${table}\`;`)
      console.log(`   dropped  ${table}`)
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1;')
    console.log('')
  }

  // ── Run schema.sql ────────────────────────────────────────────────────────
  console.log('📦 Running schema.sql...')
  let sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')

  // Replace whatever DB name is hard-coded in schema.sql with the one from .env
  sql = sql
    .replace(/CREATE DATABASE IF NOT EXISTS `?\w+`?/i,
             `CREATE DATABASE IF NOT EXISTS \`${DB}\``)
    .replace(/^USE `?\w+`?;/im,
             `USE \`${DB}\`;`)

  await conn.query(sql)

  // ── Verify ────────────────────────────────────────────────────────────────
  console.log(`\n✅ Verifying tables in \`${DB}\`:`)
  const [rows] = await conn.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = ? ORDER BY table_name`,
    [DB]
  )

  if (rows.length === 0) {
    console.error('❌ No tables found — something went wrong.')
    await conn.end()
    process.exit(1)
  }

  for (const row of rows) {
    const name = row.TABLE_NAME ?? row.table_name ?? Object.values(row)[0]
    console.log(`   ✓  ${name}`)
  }

  await conn.end()
  console.log('\n🎉 Database ready.\n')
  process.exit(0)
}

init().catch((err) => {
  console.error('\n❌ Init failed:', err.message)
  if (err.code) console.error('   Error code:', err.code)
  process.exit(1)
})