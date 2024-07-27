import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { VideoService } from './video.service'
import sendResponse from '../../../shared/sendResponse'
import { IUploadResponse } from './video.interface'
import httpStatus from 'http-status'

const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body
  const filePath = req.file
  // console.log('req.file', req.file)
  const userId = req.user?.userId
  const payload = { title, description, filePath, userId }

  const result = await VideoService.uploadVideo(payload)

  sendResponse<IUploadResponse>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Video uploaded successfully!',
    data: result,
  })
})

const getVideoById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await VideoService.getVideoById(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video fetched successfully',
    data: result,
  })
})

export const VideoController = {
  uploadVideo,
  getVideoById,
}
