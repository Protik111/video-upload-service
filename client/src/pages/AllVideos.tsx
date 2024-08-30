import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../lib/axios'
import Header from '../components/shared/Header'
import Hls from 'hls.js'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'

interface Video {
  id: string
  title: string
  description: string
  filePath: string
  createdAt: string
  userId: string
}

const AllVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get('/video')
        if (response.data.success) {
          setVideos(response.data.data.videos)
        } else {
          setError('Failed to fetch videos')
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    videos.forEach(video => {
      if (Hls.isSupported()) {
        const videoElement = videoRefs.current[video.id]
        if (videoElement) {
          const hls = new Hls()
          hls.loadSource(video.filePath)
          hls.attachMedia(videoElement)
        }
      }
    })
  }, [videos])

  if (loading) {
    return (
      <div className="main_content mt-[4.2rem] py-10">
        <Header />
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          <Skeleton count={5} />
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="main_content mt-[4.2rem] py-10">
      <Header />
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
        {videos?.length > 0 &&
          videos?.map(video => (
            <div key={video.id} className="relative">
              <div>
                <video
                  ref={el => (videoRefs.current[video.id] = el)}
                  style={{ pointerEvents: 'none' }}
                  className="rounded-md w-full h-[400px] object-cover"
                />
                <Link
                  to={`/video/${video.id}`}
                  className="absolute inset-0"
                  onClick={() =>
                    console.log('Navigating to video ID:', video.id)
                  }
                />
              </div>
              <div className="flex justify-start">
                <div>
                  <p className="font-semibold text-lg">{video?.title}</p>
                  <p className="text-secondary-text text-sm">
                    Uploaded on:{' '}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {videos?.length === 0 && (
        <div className="flex justify-center flex-col items-center">
          <p className="text-secondary-text text-xl">
            There is no video to play!
          </p>
          <Link to="/video-upload">
            <button
              type="submit"
              className="btn-dark-full relative text-regular max-w-max mt-4"
            >
              Upload & Play &rarr;
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default AllVideos
