import * as appService from '../services/application.service.js'

export async function listApplications(req, res, next) {
  try {
    const data = await appService.getAll(req.user.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function getApplication(req, res, next) {
  try {
    const data = await appService.getOne(req.user.userId, Number(req.params.id))
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function getTimeline(req, res, next) {
  try {
    const data = await appService.getTimeline(req.user.userId, Number(req.params.id))
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function createApplication(req, res, next) {
  try {
    const data = await appService.create(req.user.userId, req.body)
    res.status(201).json({ success: true, data })
  } catch (err) { next(err) }
}

export async function updateApplication(req, res, next) {
  try {
    const data = await appService.update(req.user.userId, Number(req.params.id), req.body)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function deleteApplication(req, res, next) {
  try {
    await appService.remove(req.user.userId, Number(req.params.id))
    res.json({ success: true, message: 'Application deleted' })
  } catch (err) { next(err) }
}

export async function getStats(req, res, next) {
  try {
    const data = await appService.getStats(req.user.userId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}