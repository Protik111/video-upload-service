import { Video } from '@prisma/client'
import { IUplaodVideo } from './video.interface'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { VideoUtils } from './video.utils'

const uploadVideo = async (paylod: IUplaodVideo): Promise<Video> => {
  const { title, description, filePath, userId } = paylod

  if (!filePath || typeof filePath === 'string') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'File path is invalid or undefined',
    )
  }

  // Assuming filePath is of type File or Express.Multer.File
  const fileLocation = filePath.path || ''

  const videoTitle = await prisma.video.findFirst({
    where: {
      title,
    },
  })

  if (videoTitle) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Video with this title is already exists',
    )
  }

  //videos params
  const videoId = uuidv4()
  const outputPath = path.resolve(
    __dirname,
    `../../../../compressed-video/${videoId}`,
  )
  const hlsPath = path.resolve(outputPath, 'index.m3u8')

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // Wait for the video conversion to complete
  const videoUrl = await VideoUtils.convertVideoToHLS(
    fileLocation,
    outputPath,
    hlsPath,
    videoId,
  )

  const newVideo = await prisma.video.create({
    data: {
      title,
      description,
      filePath: videoUrl,
      userId,
    },
  })

  return newVideo
}

export const VideoService = {
  uploadVideo,
}
