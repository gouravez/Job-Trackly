import * as authService from '../services/auth.service.js'

// ---------------------------------------------------------------------------
// Controllers are thin — they only handle req/res and call service functions.
// ---------------------------------------------------------------------------

export async function signupController(req, res, next) {
  try {
    const data = await authService.signup(req.body)
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function signinController(req, res, next) {
  try {
    const data = await authService.signin(req.body)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getMeController(req, res, next) {
  try {
    const user = await authService.getMe(req.user.userId)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export async function signoutController(_req, res) {
  // JWT is stateless — client just drops the token.
  // If you add a token blacklist later, handle it here.
  res.json({ success: true, message: 'Signed out successfully' })
}

export async function forgotPasswordController(req, res, next) {
  try {
    const result = await authService.sendPasswordResetOtp(req.body.email)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}