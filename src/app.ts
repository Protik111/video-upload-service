import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import routes from './app/routes'
import path from 'path'

const app: Application = express()

const corsOptions = {
  origin: '*',
}

app.use(cors(corsOptions))
app.use(cookieParser())
//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the "compressed-video" directory
const compressedVideoPath = path.resolve(
  process.cwd(),
  'compressed-video/03fb616b-b7c4-42b6-8eef-48c08b4444eb',
)
// console.log('compressedVideoPath:', compressedVideoPath)
app.use('/uploads/compressed', express.static(compressedVideoPath))

//routes
app.use('/api/v1', routes)

//health route
app.use('/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    health: 'Ok',
  })
})

//global error handler
app.use(globalErrorHandler)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

export default app
