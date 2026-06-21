import pool from './db.js'

// ---------------------------------------------------------------------------
// One-time OAuth code store (MySQL-backed).
// After Google OAuth, instead of putting the JWT in the redirect URL, we
// generate a short-lived opaque code, store { token, user } keyed by it,
// and redirect with only ?code=<code>. The frontend POSTs the code back to
// /api/auth/google/token to exchange it for the real JWT — over HTTPS,
// never visible in logs, history, or Referer headers.
//
// TTL: 60 seconds. Codes are single-use (deleted on exchange).
// Survives server restarts and works across multiple instances.
//
// Requires this table (add to schema.sql):
//   CREATE TABLE IF NOT EXISTS oauth_codes (
//     code       CHAR(64)  NOT NULL PRIMARY KEY,
//     token      TEXT      NOT NULL,
//     user_json  TEXT      NOT NULL,
//     expires_at TIMESTAMP NOT NULL,
//     INDEX idx_oauth_expires (expires_at)
//   );
// ---------------------------------------------------------------------------

const CODE_TTL_MS = 60_000 // 60 seconds

export async function storeCode(code, { token, user }) {
  const expires = new Date(Date.now() + CODE_TTL_MS)
  await pool.query(
    `INSERT INTO oauth_codes (code, token, user_json, expires_at) VALUES (?, ?, ?, ?)`,
    [code, token, JSON.stringify(user), expires]
  )
}

export async function consumeCode(code) {
  const [rows] = await pool.query(
    `SELECT token, user_json, expires_at FROM oauth_codes WHERE code = ?`,
    [code]
  )
  if (!rows[0]) return null

  // Delete immediately — single-use regardless of expiry check outcome
  await pool.query(`DELETE FROM oauth_codes WHERE code = ?`, [code])

  if (new Date() > new Date(rows[0].expires_at)) return null

  return { token: rows[0].token, user: JSON.parse(rows[0].user_json) }
}

// Called once daily from the reminder scheduler to purge any codes that
// were generated but never exchanged (e.g. user closed the tab mid-flow).
export async function cleanupExpiredCodes() {
  const [result] = await pool.query(
    `DELETE FROM oauth_codes WHERE expires_at < NOW()`
  )
  if (result.affectedRows > 0) {
    console.log(`[oauth] Cleaned up ${result.affectedRows} expired code(s)`)
  }
}