import path from 'path'
import multer, { StorageEngine } from 'multer'
import fs from 'fs'
import { Request, Express } from 'express'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { RedisClient } from '../../../shared/redis'

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../../../uplaods')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadsDir)
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

//redis rate limiter
const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) =>
      RedisClient.redisClient.sendCommand(args),
  }),
  windowMs: 5 * 1000, // 5 seconds
  max: 2, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
})

export const VideoMiddlewares = {
  upload,
  rateLimiter,
}
