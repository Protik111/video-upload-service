import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { VideoValidation } from './video.validation'
import { VideoController } from './video.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { VideoMiddlewares } from './video.middlewares'

const router = Router()

router.get('/:id', VideoController.getVideoById)

router.post(
  '/upload',
  // validateRequest(VideoValidation.uploadVideoZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  VideoMiddlewares.upload.single('video'),
  VideoController.uploadVideo,
)

export const VideoRoutes = router
