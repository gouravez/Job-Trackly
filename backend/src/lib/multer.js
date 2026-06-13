import multer from 'multer'
import { AppError } from '../middleware/error.middleware.js'

// Store in memory — we stream directly to S3, never touch disk
const storage = multer.memoryStorage()

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new AppError('Only PDF and Word documents are allowed', 422))
    }
  },
})