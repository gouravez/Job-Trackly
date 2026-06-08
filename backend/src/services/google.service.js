import pool from '../lib/db.js'
import { signToken } from '../lib/jwt.js'

// ---------------------------------------------------------------------------
// Called after Google verifies the user.
// If the user exists → sign in. If not → create account (no password needed).
// ---------------------------------------------------------------------------
export async function googleAuth({ googleId, email, firstName, lastName, avatar }) {
  // 1. Try to find by email
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, email, user_type FROM users WHERE email = ?`,
    [email]
  )

  let userId

  if (rows[0]) {
    // Existing user — just sign them in
    userId = rows[0].id
  } else {
    // New user — create account (password_hash left empty for OAuth users)
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, user_type)
       VALUES (?, ?, ?, '', 'Job Seeker')`,
      [firstName || 'User', lastName || '', email]
    )
    userId = result.insertId
  }

  // 2. Fetch full user row
  const [userRows] = await pool.query(
    `SELECT id, first_name, last_name, email, user_type FROM users WHERE id = ?`,
    [userId]
  )
  const u = userRows[0]

  // 3. Issue JWT — same shape as email/password auth
  const token = signToken({ userId: u.id, email: u.email })

  return {
    token,
    user: {
      id:        u.id,
      firstName: u.first_name,
      lastName:  u.last_name,
      name:      `${u.first_name} ${u.last_name}`,
      email:     u.email,
      userType:  u.user_type,
    },
  }
}