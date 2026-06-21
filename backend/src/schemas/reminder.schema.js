import { z } from 'zod'

export const updateReminderSettingsSchema = z.object({
  reminderEnabled:   z.boolean(),
  reminderDays:      z.coerce.number().int().min(1, 'reminderDays must be between 1 and 90').max(90, 'reminderDays must be between 1 and 90'),
  reminderFrequency: z.enum(['daily', 'weekly'], { errorMap: () => ({ message: 'reminderFrequency must be "daily" or "weekly"' }) }),
})