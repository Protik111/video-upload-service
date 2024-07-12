import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'

const router = express.Router()

const modulesRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

modulesRoutes.forEach(route => router.use(route?.path, route?.route))
export default router
