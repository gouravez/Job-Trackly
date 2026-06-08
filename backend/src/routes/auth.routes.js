import { Router } from 'express'
import { validate }  from '../middleware/validate.middleware.js'
import { protect }   from '../middleware/auth.middleware.js'
import { signupSchema, signinSchema } from '../schemas/auth.schema.js'
import {
  signupController,
  signinController,
  getMeController,
  signoutController,
} from '../controllers/auth.controller.js'

const router = Router()

// Public
router.post('/signup',  validate(signupSchema),  signupController)
router.post('/signin',  validate(signinSchema),  signinController)
router.post('/signout', signoutController)

// Protected
router.get('/me', protect, getMeController)

export default router