import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VideoPlayer from '../components/VideoPlayer'
import { useParams } from 'react-router-dom'
import Header from '../components/shared/Header'

const SingleVideo: React.FC = () => {
  const { id } = useParams()
  const [hlsUrl, setHlsUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://www.localhost:5000/api/v1/video/${id}`,
        )
        setHlsUrl(response.data.data.filePath)
      } catch (error) {
        console.error('Error fetching video data:', error)
      }
    }

    fetchVideo()
  }, [id])

  if (!hlsUrl) {
    return <p>Loading video...</p>
  }

  return (
    <div className="main_content mt-[4.2rem] py-10">
      <Header />
      <div className="grid justify-center">
        <VideoPlayer hlsUrl={hlsUrl} />
      </div>
    </div>
  )
}

export default SingleVideo
