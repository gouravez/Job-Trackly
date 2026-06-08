import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { ENV } from '../config/env.js'
import { googleAuth } from '../services/google.service.js'

const router = Router()

// ---------------------------------------------------------------------------
// Configure Passport Google Strategy
// ---------------------------------------------------------------------------
const CALLBACK_URL = 'http://localhost:4000/api/auth/google/callback'
console.log('Google OAuth callbackURL:', CALLBACK_URL)

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
// Step 1 — redirect user to Google consent screen
// GET /api/auth/google
// ---------------------------------------------------------------------------
router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
)

// ---------------------------------------------------------------------------
// Step 2 — Google redirects back here after user consents
// GET /api/auth/google/callback
// ---------------------------------------------------------------------------
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${ENV.CLIENT_URL}/signin?error=google` }),
  (req, res) => {
    console.log('Google callback req.user:', req.user)

    if (!req.user) {
      console.log('No req.user — passport failed silently')
      return res.redirect(`${ENV.CLIENT_URL}/signin?error=google`)
    }

    const { token, user } = req.user
    console.log('Token:', token ? 'present' : 'missing')
    console.log('User:', user)

    const userB64 = Buffer.from(JSON.stringify(user)).toString('base64').replace(/=/g, '')
    const url = `${ENV.CLIENT_URL}/auth/callback?token=${token}&user=${userB64}`
    console.log('Redirecting to:', url)
    res.redirect(url)
  }
)

export default router