import { z } from 'zod'

export const createReferralSchema = z.object({
  name:           z.string().min(1, 'Name is required').max(255),
  email:          z.string().email().optional().or(z.literal('')),
  phone:          z.string().max(50).optional().or(z.literal('')),
  title:          z.string().max(255).optional().or(z.literal('')),
  company:        z.string().max(255).optional().or(z.literal('')),
  linkedin:       z.string().max(255).optional().or(z.literal('')),
  relationship:   z.enum(['Colleague', 'Friend', 'Alumni', 'Recruiter', 'Manager', 'Mentor', 'Other']).default('Other'),
  strength:       z.coerce.number().int().min(1).max(5).default(3),
  notes:          z.string().optional().or(z.literal('')),
  last_contacted: z.string().optional().or(z.literal('')),
  applicationIds: z.array(z.number().int()).optional(),
})

export const updateReferralSchema = createReferralSchema.partial()