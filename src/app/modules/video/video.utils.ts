import { exec } from 'child_process'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { v2 as cloudinary } from 'cloudinary'
import util from 'util'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

cloudinary.config({
  cloud_name: 'dukinbgee',
  api_key: '177946576474248',
  api_secret: '9_jFRnOEilzJ3pYi4n1PYbf-39A',
})

// Helper function to escape paths
const normalizePath = (p: string): string => p.replace(/\\/g, '/')

const execPromise = util.promisify(exec)

const compressVideo = async (
  inputPath: string | Express.Multer.File | undefined,
  outputPath: string,
): Promise<void> => {
  if (!inputPath) {
    throw new Error('Input path is undefined')
  }

  // Convert inputPath to string if it's an object
  const inputPathStr =
    typeof inputPath === 'string'
      ? inputPath
      : (inputPath as Express.Multer.File).path
  const normalizedInputPath = normalizePath(inputPathStr)
  const normalizedOutputPath = normalizePath(outputPath)

  // Check if the input file exists
  if (!fs.existsSync(normalizedInputPath)) {
    throw new Error(`Input file does not exist: ${normalizedInputPath}`)
  }

  // Compress video using fluent-ffmpeg
  return new Promise((resolve, reject) => {
    ffmpeg(normalizedInputPath)
      .videoBitrate('1000k')
      .audioBitrate('128k')
      .save(normalizedOutputPath)
      .on('end', () => {
        console.log('Compression finished')
        resolve()
      })
      .on('error', (err: any) => {
        console.error(`FFmpeg error: ${err.message}`)
        reject(err)
      })
  })

  // // Construct the FFmpeg command
  // const command = `ffmpeg -i "${escapedInputPath}" -b:v 1000k -b:a 128k "${escapedOutputPath}"`

  // try {
  //   // Execute the FFmpeg command
  //   await execPromise(command)
  // } catch (error: any) {
  //   console.error(`FFmpeg command failed: ${error.message}`)
  //   console.error(`Command: ${command}`)
  // }
}

const videoUploadToCloudinary = (
  file: string,
): Promise<{ url: string; id: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: 'video',
      },
      (error, result: any) => {
        if (error) {
          reject(error)
        } else {
          resolve({ url: result.secure_url, id: result.public_id })
        }
      },
    )
  })
}

// convert video to HLS format using ffmpeg
const convertVideoToHLS = (
  fileLocation: string,
  outputPath: string,
  hlsPath: string,
  videoId: string,
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

export const VideoUtils = {
  convertVideoToHLS,
  videoUploadToCloudinary,
  compressVideo,
}
