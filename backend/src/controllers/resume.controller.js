import * as resumeService from '../services/resume.service.js'

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(422).json({ success: false, message: 'No file provided' })
    }

    const data = await resumeService.uploadResume({
      userId:        req.user.userId,
      applicationId: req.body.applicationId || null,
      file:          req.file,
    })

    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function list(req, res, next) {
  try {
    const data = await resumeService.listResumes({
      userId:        req.user.userId,
      applicationId: req.query.applicationId || null,
    })

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getOne(req, res, next) {
  try {
    const data = await resumeService.getResume({
      resumeId: Number(req.params.id),
      userId:   req.user.userId,
    })

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    await resumeService.deleteResume({
      resumeId: Number(req.params.id),
      userId:   req.user.userId,
    })

    res.json({ success: true, message: 'Resume deleted' })
  } catch (err) {
    next(err)
  }
}

export async function linkToApplication(req, res, next) {
  try {
    const data = await resumeService.linkResumeToApplication({
      resumeId:      Number(req.params.id),
      applicationId: Number(req.body.applicationId),
      userId:        req.user.userId,
    })

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}