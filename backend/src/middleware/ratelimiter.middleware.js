// ---------------------------------------------------------------------------
// Rate limiting for sensitive auth endpoints.
// Uses express-rate-limit (install: npm i express-rate-limit).
//
// Three tiers:
//   otpLimiter         — strictest: 5 requests / 15 min per IP
//                        Protects /send-otp and /forgot-password from
//                        being used to spam arbitrary email addresses.
//
//   signinLimiter      — 10 requests / 15 min per IP
//                        Prevents brute-force password guessing.
//
//   resetLimiter       — 5 requests / 15 min per IP
//                        /reset-password: OTP already limits guesses, but
//                        still cap at the same rate as issuance.
//
// All limiters use the default in-memory store (MemoryStore), which is
// per-process and resets on restart — good enough for a single-instance
// server. If you scale horizontally later, swap in rate-limit-redis.
// ---------------------------------------------------------------------------

import rateLimit from 'express-rate-limit'
import { ENV } from '../config/env.js'

// Skip limiting in test environments so unit/integration tests aren't blocked
const skip = () => ENV.NODE_ENV === 'test'

// Shared options
const shared = {
  skip,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders:   false,  // Don't set X-RateLimit-* headers
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests — please wait before trying again.',
    })
  },
}

// 5 requests per 15 minutes — for OTP send and forgot-password
export const otpLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many OTP requests from this IP. Please wait 15 minutes.',
})

// 10 requests per 15 minutes — for sign-in
export const signinLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 10,
})

// 5 requests per 15 minutes — for password reset submission
export const resetLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 5,
})