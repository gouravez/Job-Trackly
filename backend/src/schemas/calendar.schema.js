import { z } from 'zod'

export const createEventSchema = z.object({
  applicationId: z.coerce.number().int(),
  eventType:     z.string().min(1, 'eventType is required'),
  date:          z.string().min(1, 'date is required'),
})

export const deleteEventSchema = z.object({
  applicationId: z.coerce.number().int(),
  eventType:     z.string().min(1, 'eventType is required'),
})