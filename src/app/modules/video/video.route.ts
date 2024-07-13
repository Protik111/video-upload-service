import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { VideoValidation } from './video.validation'
import upload from './video.middlewares'

const router = Router()

router.post(
  '/video',
  validateRequest(VideoValidation.uploadVideoZodSchema),
  upload.single('video'),
)
