import { z } from 'zod'

export const linkResumeSchema = z.object({
  applicationId: z.coerce.number().int(),
})