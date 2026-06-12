// backend/src/services/referral.service.js
import pool from '../lib/db.js'
import { AppError } from '../middleware/error.middleware.js'

function toReferral(row) {
  return {
    id:            row.id,
    name:          row.name,
    email:         row.email,
    phone:         row.phone,
    title:         row.title,
    company:       row.company,
    linkedin:      row.linkedin,
    relationship:  row.relationship,
    strength:      row.strength,
    notes:         row.notes,
    lastContacted: row.last_contacted,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
    // joined fields
    applications:  row.applications ?? [],
  }
}

// ── Get all (with linked application count + list) ────────────────────────────
export async function getAll(userId) {
  const [rows] = await pool.query(
    `SELECT r.*,
       COUNT(ra.application_id) AS referral_count
     FROM referrals r
     LEFT JOIN referral_applications ra ON ra.referral_id = r.id
     WHERE r.user_id = ?
     GROUP BY r.id
     ORDER BY r.strength DESC, r.name ASC`,
    [userId]
  )

  // Fetch linked applications for each referral
  if (rows.length === 0) return []

  const ids = rows.map(r => r.id)
  const [links] = await pool.query(
    `SELECT ra.referral_id, ra.referred_at,
            a.id, a.company, a.role, a.status
     FROM referral_applications ra
     JOIN applications a ON a.id = ra.application_id
     WHERE ra.referral_id IN (?)`,
    [ids]
  )

  const appsByReferral = {}
  for (const l of links) {
    if (!appsByReferral[l.referral_id]) appsByReferral[l.referral_id] = []
    appsByReferral[l.referral_id].push({
      id: l.id, company: l.company, role: l.role,
      status: l.status, referredAt: l.referred_at,
    })
  }

  return rows.map(r => toReferral({ ...r, applications: appsByReferral[r.id] ?? [] }))
}

// ── Get one ───────────────────────────────────────────────────────────────────
export async function getOne(userId, id) {
  const [rows] = await pool.query(
    'SELECT * FROM referrals WHERE id = ? AND user_id = ?', [id, userId]
  )
  if (!rows[0]) throw new AppError('Referral not found', 404)

  const [links] = await pool.query(
    `SELECT ra.referred_at, a.id, a.company, a.role, a.status
     FROM referral_applications ra
     JOIN applications a ON a.id = ra.application_id
     WHERE ra.referral_id = ?`,
    [id]
  )

  return toReferral({
    ...rows[0],
    applications: links.map(l => ({
      id: l.id, company: l.company, role: l.role,
      status: l.status, referredAt: l.referred_at,
    })),
  })
}

// ── Create ────────────────────────────────────────────────────────────────────
export async function create(userId, data) {
  const { name, email, phone, title, company, linkedin,
          relationship, strength, notes, last_contacted, applicationIds } = data

  const [result] = await pool.query(
    `INSERT INTO referrals
       (user_id, name, email, phone, title, company, linkedin,
        relationship, strength, notes, last_contacted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, email||null, phone||null, title||null, company||null,
     linkedin||null, relationship||'Other', strength||3,
     notes||null, last_contacted||null]
  )

  const newId = result.insertId

  if (applicationIds?.length) {
    const vals = applicationIds.map(aid => [newId, aid])
    await pool.query(
      'INSERT IGNORE INTO referral_applications (referral_id, application_id) VALUES ?',
      [vals]
    )
  }

  return getOne(userId, newId)
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function update(userId, id, data) {
  await getOne(userId, id)

  const MAP = {
    name: 'name', email: 'email', phone: 'phone', title: 'title',
    company: 'company', linkedin: 'linkedin', relationship: 'relationship',
    strength: 'strength', notes: 'notes', last_contacted: 'last_contacted',
  }

  const fields = [], values = []
  for (const [key, col] of Object.entries(MAP)) {
    if (data[key] !== undefined) {
      fields.push(`${col} = ?`)
      values.push(data[key] === '' ? null : data[key])
    }
  }

  if (fields.length) {
    values.push(id, userId)
    await pool.query(
      `UPDATE referrals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    )
  }

  return getOne(userId, id)
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function remove(userId, id) {
  await getOne(userId, id)
  await pool.query('DELETE FROM referrals WHERE id = ? AND user_id = ?', [id, userId])
}

// ── Link / unlink application ─────────────────────────────────────────────────
export async function linkApplication(userId, referralId, applicationId, referredAt) {
  await getOne(userId, referralId)
  await pool.query(
    `INSERT IGNORE INTO referral_applications (referral_id, application_id, referred_at)
     VALUES (?, ?, ?)`,
    [referralId, applicationId, referredAt || null]
  )
}

export async function unlinkApplication(userId, referralId, applicationId) {
  await getOne(userId, referralId)
  await pool.query(
    'DELETE FROM referral_applications WHERE referral_id = ? AND application_id = ?',
    [referralId, applicationId]
  )
}