import { exec } from 'child_process'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { v2 as cloudinary } from 'cloudinary'
import util from 'util'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import ffmpegStatic from 'ffmpeg-static'

cloudinary.config({
  cloud_name: 'dukinbgee',
  api_key: '177946576474248',
  api_secret: '9_jFRnOEilzJ3pYi4n1PYbf-39A',
})

//const execPromise = util.promisify(exec)

// Helper function to escape paths
const normalizePath = (p: string): string => p.replace(/\\/g, '/')

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
  const outputDir = path.dirname(normalizedOutputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Check if the input file exists
  if (!fs.existsSync(normalizedInputPath)) {
    throw new Error(`Input file does not exist: ${normalizedInputPath}`)
  }

  return new Promise((resolve, reject) => {
    // Compress video and generate HLS chunks using fluent-ffmpeg
    ffmpeg(normalizedInputPath)
      .videoCodec('libx264') // Use H.264 video codec
      .audioCodec('aac') // Use AAC audio codec
      .outputOptions([
        '-b:v 1000k', // Video bitrate
        '-b:a 128k', // Audio bitrate
        '-hls_time 10', // Segment length (10 seconds)
        '-hls_list_size 0', // Include all segments in the playlist
        '-hls_segment_filename', // Filename pattern for segments
        path.join(outputDir, 'chunk_%03d.ts'),
        '-hls_playlist_type vod', // Video on Demand
      ])
      .output(path.join(outputDir, 'playlist.m3u8')) // Save playlist file
      .on('end', () => {
        console.log('HLS Segmentation and Compression finished')
        resolve()
      })
      .on('progress', progress => {
        console.log(`Processing: ${progress.percent}% done`)
      })
      .on('error', (err: any) => {
        console.error(`FFmpeg error: ${err.message}`)
        reject(err)
      })
      .run()
  })

  // // Construct the FFmpeg command
  // const command = ffmpeg -i "${escapedInputPath}" -b:v 1000k -b:a 128k "${escapedOutputPath}"

  // try {
  //   // Execute the FFmpeg command
  //   await execPromise(command)
  // } catch (error: any) {
  //   console.error(FFmpeg command failed: ${error.message})
  //   console.error(Command: ${command})
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
