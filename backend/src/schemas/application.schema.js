import { z } from 'zod'

export const createApplicationSchema = z.object({
  company:     z.string().min(1, 'Company is required').max(255),
  role:        z.string().min(1, 'Role is required').max(255),
  location:    z.string().max(255).optional(),
  status:      z.enum(['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']).default('Applied'),
  priority:    z.enum(['Low', 'Medium', 'High']).default('Medium'),
  jobUrl:      z.string().url('Invalid URL').optional().or(z.literal('')),
  jobType:     z.enum(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']).optional(),
  salary:      z.string().max(100).optional(),
  notes:       z.string().optional(),
  dateApplied: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
})

export const updateApplicationSchema = createApplicationSchema.partial()

export const moveApplicationSchema = z.object({
  status: z.enum(['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']),
})