import * as referralService from '../services/referral.service.js'

export async function listReferrals(req, res, next) {
  try {
    const data = await referralService.getAll(req.user.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function getReferral(req, res, next) {
  try {
    const data = await referralService.getOne(req.user.userId, req.params.id)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function createReferral(req, res, next) {
  try {
    const data = await referralService.create(req.user.userId, req.body)
    res.status(201).json({ success: true, data })
  } catch (err) { next(err) }
}

export async function updateReferral(req, res, next) {
  try {
    const data = await referralService.update(req.user.userId, req.params.id, req.body)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function deleteReferral(req, res, next) {
  try {
    await referralService.remove(req.user.userId, req.params.id)
    res.json({ success: true })
  } catch (err) { next(err) }
}

export async function linkApplication(req, res, next) {
  try {
    await referralService.linkApplication(
      req.user.userId, req.params.id, req.body.applicationId, req.body.referredAt
    )
    res.json({ success: true })
  } catch (err) { next(err) }
}

export async function unlinkApplication(req, res, next) {
  try {
    await referralService.unlinkApplication(req.user.userId, req.params.id, req.params.appId)
    res.json({ success: true })
  } catch (err) { next(err) }
}