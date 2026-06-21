import { changePassword, updateProfile } from '../services/user.service.js'

export async function changeUserPassword(req, res, next) {
  try {
    await changePassword(req.user.userId, req.body)
    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) { next(err) }
}

export async function updateUserProfile(req, res, next) {
  try {
    await updateProfile(req.user.userId, req.body)
    res.json({ success: true, message: 'Profile updated successfully' })
  } catch (err) { next(err) }
}