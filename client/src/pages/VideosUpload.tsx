import React, { useState } from 'react'
import Header from '../components/shared/Header'
import { toast, Toaster } from 'sonner'
import useValidator from '../hooks/useValidator'
import { AxiosError } from 'axios'
import axiosInstance from '../lib/axios'
import Spinner from '../components/ui/Spinner'

const VideosUpload: React.FC = () => {
  const [pulse, setPulse] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoPreview, setVideoPreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { errors, validate } = useValidator()

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    console.log('files', files)
    handleFile(files)
  }

  const handleFile = (files: FileList) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 2 MB in bytes

    if (files.length > 0) {
      const file = files[0]

      if (!isVideo(file)) {
        toast.error('Only video is acceptable!')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds the 10 MB limit!')
        return
      }

      setPulse(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const isVideo = (file: File) => {
    return file.type.startsWith('video/')
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()

    if (
      e.dataTransfer.types &&
      Array.from(e.dataTransfer.types).includes('Files')
    ) {
      const files = e.dataTransfer.files
      const containsNonVideo = Array.from(files).some(
        file => !file.type.startsWith('video/'),
      )

      if (containsNonVideo) {
        e.dataTransfer.dropEffect = 'none'
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFile(files)
    }
  }

  const uploadVideo = async () => {
    const customMessages = {
      videoPreview: 'Video is required!',
      title: 'Title is required!',
      description: 'Description is required!',
    }

    const { isError } = validate(
      { videoPreview, title, description },
      customMessages,
    )

    if (isError) {
      return
    }

    const formData = new FormData()
    if (pulse) {
      formData.append('video', pulse)
    }
    formData.append('title', title)
    formData.append('description', description)

    try {
      setIsLoading(true)

      const response = await axiosInstance.post('/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response?.data?.statusCode === 201) {
        console.log(response?.data)
        toast.success(response?.data?.message)
        setPulse(null)
        setTitle('')
        setDescription('')
        setVideoPreview('')
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>

      if (error) {
        console.log(error)
        toast.error(
          axiosError?.response?.data?.message ?? 'Error to uplaod. Try again!',
        )
      } else {
        toast.error('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="main_content mt-[4.2rem] py-10">
      <Header />

      <div className="px-6 flex flex-col h-full">
        <div className="mx-auto text-left">
          <p className="text-sm font-normal text-[#607085] text-left">
            Add Video Here
            <span className="text-[#F9020B]"> *</span>
          </p>
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            htmlFor="file"
            className="cursor-pointer text-sm font-semibold bg-[#F8F9FB] h-[400px] w-[660px] border border-[#EAECF0] rounded-md"
          >
            {videoPreview ? (
              <div className="relative">
                <video
                  className="h-[400px] w-[660px]"
                  controls
                  src={videoPreview}
                />
                <img
                  onClick={() => {
                    setPulse(null)
                    setVideoPreview('')
                  }}
                  className="absolute md:w-8 md:h-8 cursor-pointer"
                  src="/assets/remove.png"
                  alt="Remove"
                  style={{
                    right: '-15px',
                    top: '-15px',
                  }}
                />
              </div>
            ) : (
              <>
                <img
                  className="h-12 w-12 object-contain block m-auto"
                  src="/assets/upload.png"
                  alt="Add Pulse"
                />
                <div className="text-center px-4">
                  <p className="text-sm font-normal">
                    <span className="text-[#2053D5] font-semibold text-sm">
                      Click to upload
                    </span>{' '}
                    or drag and drop <br /> MP4, AVI, MOV, WMV, MKV, and FLV
                    (max 1080x1920px)
                  </p>
                </div>
              </>
            )}
            <input
              onChange={handleFileChange}
              type="file"
              id="file"
              aria-label="Browse video file"
              hidden
              accept="video/mp4,video/webm,video/ogg"
            />
          </label>
          <br />
          {errors?.videoPreview && (
            <span className="text-red-600 text-sm">{errors?.videoPreview}</span>
          )}
        </div>
        <div className="w-full mt-4 m-auto h-full text-left">
          <label className="text-sm font-normal text-[#607085]">
            Video Title
            <span className="text-[#F9020B]"> *</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Video Title"
            className="custom-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {errors?.title && (
            <span className="text-red-600 text-sm">{errors?.title}</span>
          )}
        </div>

        <div className="w-full mt-4 m-auto h-full text-left">
          <label className="text-sm font-normal text-[#607085]">
            Description
            <span className="text-[#F9020B]"> *</span>
          </label>
          <textarea
            rows={3}
            name="description"
            placeholder="Video description"
            className="custom-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errors?.description && (
            <span className="text-red-600 text-sm">{errors?.description}</span>
          )}
        </div>

        <div className="flex justify-end mt-8 gap-6 sticky bottom-0 py-6 z-50 bg-white">
          <button
            onClick={uploadVideo}
            type="submit"
            className={`font-semibold rounded-md text-base py-3 px-8 text-white bg-theme ${
              isLoading ? 'cursor-progress' : 'cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : 'Upload'}
          </button>
        </div>

        <Toaster position="top-center" richColors></Toaster>
      </div>
    </div>
  )
}

export default VideosUpload
