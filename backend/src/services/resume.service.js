import pool from '../lib/db.js'
import { uploadToS3, deleteFromS3, getPresignedUrl, buildResumeKey } from '../lib/s3.js'
import { AppError } from '../middleware/error.middleware.js'

// ── Upload resume → S3 + save to DB ───────────────────────────────────────
export async function uploadResume({ userId, applicationId, file }) {
  const key = buildResumeKey(userId, file.originalname)

  // 1. Upload to S3
  await uploadToS3({
    buffer:   file.buffer,
    key,
    mimeType: file.mimetype,
  })

  // 2. Save metadata to DB
  const [result] = await pool.query(
    `INSERT INTO resumes
       (user_id, application_id, filename, s3_key, original_name, file_size, mime_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      applicationId || null,
      key,
      key,
      file.originalname,
      file.size,
      file.mimetype,
    ]
  )

  // 3. Return with a fresh presigned URL so the UI can show it immediately
  return {
    id:           result.insertId,
    originalName: file.originalname,
    fileSize:     file.size,
    mimeType:     file.mimetype,
    s3Key:        key,
    applicationId: applicationId || null,
    createdAt:    new Date(),
    downloadUrl:  await getPresignedUrl(key, file.originalname),
  }
}

// ── List all resumes for a user (optionally filtered by application) ───────
export async function listResumes({ userId, applicationId }) {
  let query = `
    SELECT
      id, original_name, file_size, mime_type,
      s3_key, application_id, created_at
    FROM resumes
    WHERE user_id = ?
  `
  const params = [userId]

  if (applicationId) {
    query  += ' AND application_id = ?'
    params.push(applicationId)
  }

  query += ' ORDER BY created_at DESC'

  const [rows] = await pool.query(query, params)

  // Generate a fresh presigned URL for every resume
  return Promise.all(
    rows.map(async (r) => ({
      id:            r.id,
      originalName:  r.original_name,
      fileSize:      r.file_size,
      mimeType:      r.mime_type,
      applicationId: r.application_id,
      createdAt:     r.created_at,
      downloadUrl:   await getPresignedUrl(r.s3_key, r.original_name),
    }))
  )
}

// ── Get single resume with a fresh presigned URL ──────────────────────────
export async function getResume({ resumeId, userId }) {
  const [rows] = await pool.query(
    'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
    [resumeId, userId]
  )

  if (!rows[0]) throw new AppError('Resume not found', 404)

  const r = rows[0]
  return {
    id:            r.id,
    originalName:  r.original_name,
    fileSize:      r.file_size,
    mimeType:      r.mime_type,
    applicationId: r.application_id,
    createdAt:     r.created_at,
    downloadUrl:   await getPresignedUrl(r.s3_key, r.original_name),
  }
}

// ── Delete resume from S3 + DB ────────────────────────────────────────────
export async function deleteResume({ resumeId, userId }) {
  // Verify ownership and get the S3 key
  const [rows] = await pool.query(
    'SELECT id, s3_key FROM resumes WHERE id = ? AND user_id = ?',
    [resumeId, userId]
  )

  if (!rows[0]) throw new AppError('Resume not found', 404)

  // Delete from S3 first, then DB
  await deleteFromS3(rows[0].s3_key)
  await pool.query('DELETE FROM resumes WHERE id = ?', [resumeId])

  return { deleted: true }
}

// ── Link existing resume to an application ────────────────────────────────
export async function linkResumeToApplication({ resumeId, applicationId, userId }) {
  const [rows] = await pool.query(
    'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
    [resumeId, userId]
  )

  if (!rows[0]) throw new AppError('Resume not found', 404)

  await pool.query(
    'UPDATE resumes SET application_id = ? WHERE id = ?',
    [applicationId, resumeId]
  )

  return { linked: true }
}