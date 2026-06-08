import mysql from 'mysql2/promise'
import { ENV } from '../config/env.js'

// ---------------------------------------------------------------------------
// Connection pool — shared across the entire app.
// All services import pool and call pool.query() directly.
// ---------------------------------------------------------------------------

const pool = mysql.createPool({
  host:               ENV.DB_HOST,
  port:               Number(ENV.DB_PORT),
  user:               ENV.DB_USER,
  password:           ENV.DB_PASSWORD,
  database:           ENV.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'Z',
})

export async function testConnection() {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL connected successfully')
    conn.release()
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message)
    process.exit(1)
  }
}

export default pool