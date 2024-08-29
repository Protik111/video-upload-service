import React, { useState } from 'react'
import Header from '../components/shared/Header'
import { toast, Toaster } from 'sonner'

const VideosUpload: React.FC = () => {
  const [pulse, setPulse] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoPreview, setVideoPreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDrop = e => {
    e.preventDefault()
    const files = e.dataTransfer.files
    console.log('files', files)
    handleFile(files)
  }

  const handleFile = files => {
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

  const isVideo = file => {
    return file.type.startsWith('video/')
  }

  const handleDragOver = e => {
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

  const handleFileChange = e => {
    const files = e.target.files
    handleFile(files)
  }

  const postPulse = async () => {}

  return (
    <div className="main_content mt-[4.2rem] py-10">
      <Header />

      <div className="px-6 flex flex-col h-full">
        <div className="mx-auto">
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
          {/* {errors?.pulse && (
          <span className="text-red-600 text-sm">{errors?.pulse}</span>
        )} */}
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
          {/* {errors?.title && (
          <span className="text-red-600 text-sm">{errors?.title}</span>
        )} */}
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
          {/* {errors?.description && (
          <span className="text-red-600 text-sm">{errors?.description}</span>
        )} */}
        </div>

        {/* button container */}
        <div className="flex justify-end mt-8 gap-6 sticky bottom-0 py-6 z-50 bg-white">
          <button
            onClick={postPulse}
            type="submit"
            className={`font-semibold rounded-md text-base py-3 px-8 text-white bg-theme ${
              isLoading ? 'cursor-progress' : 'cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading' : 'Upload'}
          </button>
        </div>

        {/* {postError && (
        <div className="text-red-600 text-sm mt-2">{postError}</div>
      )} */}
        <Toaster position="top-center" richColors></Toaster>
      </div>
    </div>
  )
}

export default VideosUpload
