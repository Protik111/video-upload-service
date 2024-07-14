import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { VideoService } from './video.service'
import sendResponse from '../../../shared/sendResponse'
import { IUploadResponse } from './video.interface'

const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body
  const filePath = req.file
  const userId = req.user?.userId
  const payload = { title, description, filePath, userId }

  const result = await VideoService.uploadVideo(payload)

  sendResponse<IUploadResponse>(res, {
    statusCode: 201,
    success: true,
    message: 'Video uploaded successfully!',
    data: result,
  })
})

export const VideoController = {
  uploadVideo,
}
