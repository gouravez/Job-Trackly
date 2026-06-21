import { z } from 'zod'

const envSchema = z.object({
  PORT:           z.string().default('4000'),
  NODE_ENV:       z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST:        z.string().min(1),
  DB_PORT:        z.string().default('3306'),
  DB_USER:        z.string().min(1),
  DB_PASSWORD:    z.string(),
  DB_NAME:        z.string().min(1),
  JWT_SECRET:            z.string().min(16),
  JWT_EXPIRES_IN:        z.string().default('7d'),
  CLIENT_URL:            z.string().url().default('http://localhost:5173'),
  API_URL:               z.string().url().default('http://localhost:4000'),
  GOOGLE_CLIENT_ID:      z.string().min(1),
  GOOGLE_CLIENT_SECRET:  z.string().min(1),
  GOOGLE_CALENDAR_REDIRECT_URI: z.string().url().default('http://localhost:4000/api/calendar/oauth/callback'),
  SMTP_HOST:     z.string().default('smtp.gmail.com'),
  SMTP_PORT:     z.string().default('587'),
  SMTP_USER:     z.string().min(1),
  SMTP_PASS:     z.string().min(1),
  SMTP_FROM:     z.string().default('Job Trackly <noreply@jobtrackly.com>'),
  AWS_ACCESS_KEY_ID:     z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION:     z.string().min(1),
  AWS_S3_BUCKET:  z.string().min(1),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const ENV = parsed.data