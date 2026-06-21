import { Router } from 'express'
import { protect }         from '../middleware/auth.middleware.js'
import { validate }        from '../middleware/validate.middleware.js'
import { uploadResume }    from '../lib/multer.js'
import { linkResumeSchema } from '../schemas/resume.schema.js'
import {
  upload,
  list,
  getOne,
  remove,
  linkToApplication,
} from '../controllers/resume.controller.js'

const router = Router()

// All resume routes require authentication
router.use(protect)

// POST   /api/resumes              — upload a new resume
// GET    /api/resumes              — list all resumes (optional ?applicationId=)
// GET    /api/resumes/:id          — get one + fresh presigned URL
// DELETE /api/resumes/:id          — delete from S3 + DB
// PATCH  /api/resumes/:id/link     — link resume to an application

router.post('/',           uploadResume.single('resume'), upload)
router.get('/',            list)
router.get('/:id',         getOne)
router.delete('/:id',      remove)
router.patch('/:id/link',  validate(linkResumeSchema), linkToApplication)

export default router