import { z } from 'zod'

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
})

export const updateProfileSchema = z.object({
  firstName:      z.string().min(1).max(100).optional(),
  lastName:       z.string().min(1).max(100).optional(),
  university:     z.string().max(255).optional(),
  graduationYear: z.coerce.number().int().min(2000).max(2100).optional(),
  userType:       z.enum(['College Student', 'Recent Graduate', 'Job Seeker']).optional(),
  bio:            z.string().max(1000).optional(),
  phone:          z.string().max(50).optional(),
  location:       z.string().max(255).optional(),
  linkedin:       z.string().max(255).optional(),
  github:         z.string().max(255).optional(),
  portfolio:      z.string().max(255).optional(),
})