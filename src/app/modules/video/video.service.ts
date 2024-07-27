import { Video } from '@prisma/client'
import { IFielPath, IUplaodVideo } from './video.interface'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { VideoUtils } from './video.utils'
import express, { Application } from 'express'

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
  // const videoId = uuidv4()
  // const outputPath = path.resolve(
  //   __dirname,
  //   `../../../../compressed-video/${videoId}`,
  // )
  // const hlsPath = path.resolve(outputPath, 'index.m3u8')

  // Prepare paths for compression and uploading
  const videoId = uuidv4()
  const compressedPath = path.resolve(
    process.cwd(),
    'compressed-video',
    videoId,
  )
  // Resolve paths
  const compressedFilePath = path.join(compressedPath, 'compressed_video.mp4')

  // Ensure the directory exists
  if (!fs.existsSync(compressedPath)) {
    fs.mkdirSync(compressedPath, { recursive: true })
  }

  // Wait for the video conversion to complete
  // const videoUrl = await VideoUtils.convertVideoToHLS(
  //   fileLocation,
  //   outputPath,
  //   hlsPath,
  //   videoId,
  // )

  const formattedFileLocation = fileLocation.replace(/\\/g, '/')
  const formattedCompressedFilePath = compressedFilePath.replace(/\\/g, '/')

  // Compress the video using FFmpeg
  await VideoUtils.compressVideo(
    formattedFileLocation,
    formattedCompressedFilePath,
  )

  // Upload the compressed video to Cloudinary
  const uploadResult =
    await VideoUtils.videoUploadToCloudinary(compressedFilePath)

  // Clean up the local compressed video file
  if (fs.existsSync(compressedFilePath)) {
    fs.unlinkSync(compressedFilePath)
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

const app: Application = express()

const getVideoById = async (id: string): Promise<IFielPath | null> => {
  const video = await prisma.video.findUnique({
    where: {
      id,
    },
  })

  if (!video) {
    return null
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
