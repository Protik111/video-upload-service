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

const uploadVideo = async (payload: IUploadVideo): Promise<Video> => {
  const { title, description, filePath, userId } = payload

  if (!filePath || typeof filePath === 'string') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'File path is invalid or undefined',
    )
  }

  const fileLocation = filePath.path || ''

  const videoTitle = await prisma.video.findFirst({ where: { title } })

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

  if (!fs.existsSync(compressedPath)) {
    fs.mkdirSync(compressedPath, { recursive: true })
  }

  // Convert the video to HLS format
  await VideoUtils.compressVideo(fileLocation, compressedPath)

  // Upload the HLS files to Cloudinary
  const hlsFiles = fs.readdirSync(compressedPath)
  const uploadPromises = hlsFiles.map(file => {
    const filePath = path.join(compressedPath, file)
    return VideoUtils.videoUploadToCloudinary(filePath)
  })

  const uploadResults = await Promise.all(uploadPromises)

  // Clean up local files
  hlsFiles.forEach(file => {
    const filePath = path.join(compressedPath, file)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })

  // Store the URLs of the uploaded HLS files in your database
  const hlsUrls = uploadResults.map(result => result.url)
  const playlistUrl = hlsUrls.find(url => url.endsWith('.m3u8')) || ''

  const newVideo = await prisma.video.create({
    data: {
      id: videoId,
      title,
      description,
      filePath: playlistUrl,
      userId,
      hlsFiles: {
        create: hlsUrls.map(url => ({ url })),
      },
    },
    include: {
      hlsFiles: true,
    },
  })

  return newVideo
}

const getVideoById = async (id: string): Promise<IFielPath | null> => {
  const video = await prisma.video.findUnique({
    where: {
      id,
    },
    include: {
      hlsFiles: true,
    },
  })

  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Video not found')
  }

  const data = {
    filePath: video.filePath,
    hlsFiles: video.hlsFiles.map(hlsFile => ({
      id: hlsFile.id,
      url: hlsFile.url,
      videoId: hlsFile.videoId,
    })),
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
