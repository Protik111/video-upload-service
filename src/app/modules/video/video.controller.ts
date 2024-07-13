import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { VideoService } from './video.service'

const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body
  const filePath = req.file
  const payload = { title, description, filePath }

  const result = await VideoService.uploadVideo(payload)
})
