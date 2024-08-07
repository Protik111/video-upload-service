import { Video } from '@prisma/client'
import { IFielPath, IUplaodVideo } from './video.interface'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { VideoUtils } from './video.utils'
import AdmZip from 'adm-zip'
import path from 'path'
import axios from 'axios'

const uploadVideo = async (paylod: IUplaodVideo): Promise<Video> => {
  const { title, description, filePath, userId } = paylod

  if (!filePath || typeof filePath === 'string') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'File path is invalid or undefined',
    )
  }

  const fileLocation = filePath.path || ''

  const videoTitle = await prisma.video.findFirst({
    where: {
      title,
    },
  })

  if (videoTitle) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Video with this title already exists',
    )
  }

  const videoId = uuidv4()
  const compressedPath = path.resolve(
    process.cwd(),
    'compressed-video',
    videoId,
  )
  const zipFilePath = path.join(compressedPath, 'hls_files.zip')

  if (!fs.existsSync(compressedPath)) {
    fs.mkdirSync(compressedPath, { recursive: true })
  }

  // Convert the video to HLS format
  await VideoUtils.compressVideo(
    fileLocation,
    path.join(compressedPath, 'compressed_video.mp4'),
  )

  //Create a zip of HLS files
  VideoUtils.createZipFromFolder(compressedPath, zipFilePath)

  //Upload the zip to Cloudinary
  const uploadResult = await VideoUtils.videoUploadToCloudinary(zipFilePath)

  // Clean up local files
  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath)
  }

  // Optionally remove other local files such as the HLS segments and playlist if needed
  if (fs.existsSync(path.join(compressedPath, 'compressed_video.mp4'))) {
    fs.unlinkSync(path.join(compressedPath, 'compressed_video.mp4'))
  }

  const newVideo = await prisma.video.create({
    data: {
      title,
      description,
      filePath: uploadResult.url,
      userId,
    },
  })

  return newVideo
}

const getVideoById = async (id: string): Promise<IFielPath | null> => {
  const video = await prisma.video.findUnique({
    where: {
      id,
    },
  })

  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Video not found')
  }

  const data = {
    filePath: `${video.filePath}`,
  }

  return data

  // const filePath = path.join(__dirname, 'compressed-video')
  // const data = {
  //   filePath,
  // }

  // return data
}

export const VideoService = {
  uploadVideo,
  getVideoById,
}
