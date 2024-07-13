import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { VideoRoutes } from '../modules/video/video.route'

const router = express.Router()

const modulesRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/video',
    route: VideoRoutes,
  },
]

modulesRoutes.forEach(route => router.use(route?.path, route?.route))
export default router
