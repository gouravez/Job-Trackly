import bcrypt from 'bcryptjs'
import pool from '../lib/db.js'
import { AppError } from '../middleware/error.middleware.js'

export async function changePassword(userId, { currentPassword, newPassword }) {
  // 1. Fetch current hash
  const [rows] = await pool.query(
    'SELECT password_hash FROM users WHERE id = ?', [userId]
  )
  if (!rows[0]) throw new AppError('User not found', 404)

  const hash = rows[0].password_hash

  // 2. OAuth users have no password — block this flow
  if (!hash) throw new AppError('Cannot change password for Google accounts', 400)

  // 3. Verify current password
  const valid = await bcrypt.compare(currentPassword, hash)
  if (!valid) throw new AppError('Current password is incorrect', 401)

  // 4. Hash and save new password
  const newHash = await bcrypt.hash(newPassword, 12)
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId])
}

export async function updateProfile(userId, data) {
  const MAP = {
    firstName:      'first_name',
    lastName:       'last_name',
    university:     'university',
    graduationYear: 'graduation_year',
    userType:       'user_type',
    bio:            'bio',
    phone:          'phone',
    location:       'location',
    linkedin:       'linkedin',
    github:         'github',
    portfolio:      'portfolio',
  }

  const fields = []
  const values = []

  for (const [key, col] of Object.entries(MAP)) {
    if (data[key] !== undefined) {
      fields.push(`${col} = ?`)
      values.push(data[key] || null)
    }
  }

  if (fields.length === 0) throw new AppError('No fields to update', 422)

  values.push(userId)
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
}