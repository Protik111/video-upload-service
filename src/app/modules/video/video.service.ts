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

const uploadVideo = async (payload: IUplaodVideo): Promise<Video> => {
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

  const userEmail = await prisma.user.findFirst({
    where: { id: userId },
    select: { email: true },
  })

  const videoId = uuidv4()
  const compressedPath = path.resolve(
    process.cwd(),
    'compressed-video',
    videoId,
  )

  if (!fs.existsSync(compressedPath)) {
    fs.mkdirSync(compressedPath, { recursive: true })
  }

  if (userEmail) {
    // Convert the video to HLS format
    await VideoUtils.compressVideo(
      fileLocation,
      compressedPath,
      userEmail.email,
    )
  }

  // Upload the HLS files to Cloudinary
  const hlsFiles = fs.readdirSync(compressedPath)

  // Upload the first file to get the base URL
  const firstFile = hlsFiles[0]
  const firstFilePath = path.join(compressedPath, firstFile)
  const firstUploadResult = await VideoUtils.videoUploadToCloudinary(
    firstFilePath,
    firstFile,
  )

  const baseUrl = firstUploadResult.url.replace(/\/[^\/]+$/, '') // Remove the last part of the URL to get the base

  // Upload the remaining files using the correct base URL
  const uploadPromises = hlsFiles.slice(1).map(file => {
    const filePath = path.join(compressedPath, file)
    return VideoUtils.videoUploadToCloudinary(filePath, file)
  })

  const uploadResults = await Promise.all(uploadPromises)
  uploadResults.unshift(firstUploadResult) // Add the first result to the array

  // Update the playlist file with the correct URLs
  await VideoUtils.updatePlaylistUrls(
    path.join(compressedPath, 'playlist.m3u8'),
    baseUrl,
  )

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

const getVideos = async (): Promise<IFielPath | null> => {
  const videos = await prisma.video.findMany()

  if (videos.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Video not found')
  }

  const data = {
    videos,
  }

  return data
}

export const VideoService = {
  uploadVideo,
  getVideoById,
  getVideos,
}
