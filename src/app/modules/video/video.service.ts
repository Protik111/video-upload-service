import { Video } from '@prisma/client'
import { IUplaodVideo } from './video.interface'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const uploadVideo = async (paylod: IUplaodVideo): Promise<Video> => {
  const { title, description, filePath } = paylod

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

  const newVideo = await prisma.video.create({
    data: {
      title,
      description,
      filePath,
    },
  })

  return newVideo
}

export const VideoService = {
  uploadVideo,
}
