import * as reminderService from '../services/reminder.service.js'

export async function getSettings(req, res, next) {
  try {
    const data = await reminderService.getSettings(req.user.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function updateSettings(req, res, next) {
  try {
    await reminderService.updateSettings(req.user.userId, req.body)
    res.json({ success: true, message: 'Reminder settings saved' })
  } catch (err) { next(err) }
}

export async function sendTestReminder(req, res, next) {
  try {
    const result = await reminderService.sendTestReminder(req.user.userId)
    if (!result.sent) {
      return res.json({ success: false, message: result.message })
    }
    res.json({ success: true, message: `Test email sent to ${result.email}` })
  } catch (err) { next(err) }
}