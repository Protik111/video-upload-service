import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { VideoValidation } from './video.validation'
import upload from './video.middlewares'
import { VideoController } from './video.controller'

const router = Router()

router.post(
  '/upload',
  // validateRequest(VideoValidation.uploadVideoZodSchema),
  upload.single('video'),
  VideoController.uploadVideo,
)

export const VideoRoutes = router
