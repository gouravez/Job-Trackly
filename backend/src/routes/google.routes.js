import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { ENV } from '../config/env.js'
import { googleAuth } from '../services/googleAuth.service.js'
import { googleCallback, exchangeCode } from '../controllers/google.controller.js'

const router = Router()

// ---------------------------------------------------------------------------
// Configure Passport Google Strategy
// ---------------------------------------------------------------------------
const CALLBACK_URL = `${ENV.API_URL || 'http://localhost:4000'}/api/auth/google/callback`

passport.use(
  new GoogleStrategy(
    {
      clientID:     ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL:  CALLBACK_URL,
      scope:        ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email     = profile.emails?.[0]?.value
        const firstName = profile.name?.givenName  || ''
        const lastName  = profile.name?.familyName || ''
        const avatar    = profile.photos?.[0]?.value || null

        if (!email) return done(new Error('No email from Google'), null)

        const result = await googleAuth({ googleId: profile.id, email, firstName, lastName, avatar })
        done(null, result)
      } catch (err) {
        done(err, null)
      }
    }
  )
)

// ---------------------------------------------------------------------------
// GET /api/auth/google — redirect user to Google consent screen
// ---------------------------------------------------------------------------
router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
)

// ---------------------------------------------------------------------------
// GET /api/auth/google/callback — Google redirects back here after consent.
// Stores a one-time code and redirects to /auth/callback?code=<code>.
// The JWT never appears in the URL.
// ---------------------------------------------------------------------------
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${ENV.CLIENT_URL}/signin?error=google` }),
  googleCallback
)

// ---------------------------------------------------------------------------
// POST /api/auth/google/token — frontend exchanges the one-time code for JWT.
// { code: string } → { success: true, data: { token, user } }
// ---------------------------------------------------------------------------
router.post('/google/token', exchangeCode)

export default router