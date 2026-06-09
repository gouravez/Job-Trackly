import bcrypt from 'bcryptjs'
import pool from '../lib/db.js'
import { sendOtpEmail } from '../lib/email.js'
import { AppError } from '../middleware/error.middleware.js'

// Generate a random 6-digit OTP
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// ---------------------------------------------------------------------------
// sendOtp — called before signup. Stores hashed OTP, sends email.
// ---------------------------------------------------------------------------
export async function sendOtp(email) {
  // Block if email already has a verified account
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ?', [email]
  )
  if (existing.length > 0) {
    throw new AppError('An account with this email already exists', 409)
  }

  const otp     = generateOtp()
  const hash    = await bcrypt.hash(otp, 8)   // lower cost — OTPs expire fast
  const expires = new Date(Date.now() + 10 * 60 * 1000)  // 10 minutes

  // Upsert — replace any existing OTP for this email
  await pool.query(
    `INSERT INTO email_otps (email, otp_hash, expires_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE otp_hash = VALUES(otp_hash), expires_at = VALUES(expires_at), created_at = NOW()`,
    [email, hash, expires]
  )

  await sendOtpEmail(email, otp)
  return { message: 'OTP sent to ' + email }
}

// ---------------------------------------------------------------------------
// verifyOtp — checks OTP, returns true if valid (does NOT delete the row).
// Deletion happens in signup() after the user is created.
// ---------------------------------------------------------------------------
export async function verifyOtp(email, otp) {
  const [rows] = await pool.query(
    'SELECT otp_hash, expires_at FROM email_otps WHERE email = ?', [email]
  )

  if (!rows[0]) throw new AppError('No OTP found for this email. Please request a new one.', 404)

  const { otp_hash, expires_at } = rows[0]

  if (new Date() > new Date(expires_at)) {
    await pool.query('DELETE FROM email_otps WHERE email = ?', [email])
    throw new AppError('OTP has expired. Please request a new one.', 410)
  }

  const valid = await bcrypt.compare(otp, otp_hash)
  if (!valid) throw new AppError('Invalid OTP. Please try again.', 401)

  return true
}

// ---------------------------------------------------------------------------
// cleanupOtp — called after successful signup to remove the used OTP row.
// ---------------------------------------------------------------------------
export async function cleanupOtp(email) {
  await pool.query('DELETE FROM email_otps WHERE email = ?', [email])
}