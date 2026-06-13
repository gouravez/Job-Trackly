import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ENV } from '../config/env.js'

// ── S3 client singleton ────────────────────────────────────────────────────
const s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId:     ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
})

// ── Upload a file buffer to S3 ─────────────────────────────────────────────
export async function uploadToS3({ buffer, key, mimeType }) {
  const command = new PutObjectCommand({
    Bucket:      ENV.AWS_S3_BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimeType,
  })

  await s3.send(command)
  return key
}

// ── Delete a file from S3 ─────────────────────────────────────────────────
export async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: ENV.AWS_S3_BUCKET,
    Key:    key,
  })

  await s3.send(command)
}

// ── Generate a presigned GET URL (temporary download link) ────────────────
// Expires in 1 hour. Sets Content-Disposition so the browser downloads
// the file with the original filename instead of the S3 key.
export async function getPresignedUrl(key, originalName, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: ENV.AWS_S3_BUCKET,
    Key:    key,
    ResponseContentDisposition: `inline; filename="${encodeURIComponent(originalName)}"`,  // ← was attachment
  })

  return getSignedUrl(s3, command, { expiresIn })
}

// ── Build S3 key for a resume ─────────────────────────────────────────────
// Format: resumes/{userId}/{timestamp}-{sanitisedName}
export function buildResumeKey(userId, originalName) {
  const timestamp = Date.now()
  const safeName  = originalName
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
  return `resumes/${userId}/${timestamp}-${safeName}`
}