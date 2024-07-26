import { Video } from '@prisma/client'
import { IUplaodVideo } from './video.interface'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import fs from 'fs'
import { exec } from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import config from '../../../config'
import path from 'path'

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

  // convert video to HLS format using ffmpeg
  const convertVideoToHLS = (
    fileLocation: string,
    outputPath: string,
    hlsPath: string,
  ) => {
    return new Promise<string>((resolve, reject) => {
      // Ensure paths are properly formatted for the command line
      const formattedFileLocation = fileLocation.replace(/\\/g, '/')
      const formattedOutputPath = outputPath.replace(/\\/g, '/')
      const formattedHlsPath = hlsPath.replace(/\\/g, '/')

      const ffmpegCommand = `ffmpeg -i "${formattedFileLocation}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${formattedOutputPath}/segment%03d.ts" -start_number 0 "${formattedHlsPath}"`

      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          reject(
            new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'Video could not processed!',
            ),
          )
        } else {
          resolve(`${config.video_compressed_dir}/${videoId}/index.m3u8`)
        }
      })
    })
  }

  // Wait for the video conversion to complete
  const videoUrl = await convertVideoToHLS(fileLocation, outputPath, hlsPath)

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
