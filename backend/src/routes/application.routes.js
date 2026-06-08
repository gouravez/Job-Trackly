import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import {
  createApplicationSchema,
  updateApplicationSchema,
} from '../schemas/application.schema.js'
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
} from '../controllers/application.controller.js'

const router = Router()

// All application routes require auth
router.use(protect)

router.get('/',          listApplications)
router.get('/stats',     getStats)
router.get('/:id',       getApplication)
router.post('/',         validate(createApplicationSchema), createApplication)
router.patch('/:id',     validate(updateApplicationSchema), updateApplication)
router.delete('/:id',    deleteApplication)

export default router