import { z } from 'zod'

export const signupSchema = z.object({
  firstName:       z.string().min(1, 'First name is required').max(100),
  lastName:        z.string().min(1, 'Last name is required').max(100),
  email:           z.string().email('Invalid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().optional(), 
  userType:        z.enum(['College Student', 'Recent Graduate', 'Job Seeker'])
                    .default('College Student'),
  university:      z.string().max(255).optional(),
  graduationYear:  z.coerce.number().int().min(2000).max(2100).optional(),
})

export const signinSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
})