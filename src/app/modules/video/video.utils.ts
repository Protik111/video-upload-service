import { exec } from 'child_process'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

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
}
