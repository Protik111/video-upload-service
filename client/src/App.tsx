import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VideoPlayer from './components/VideoPlayer'

interface AppProps {
  videoId: string
}

const App: React.FC<AppProps> = ({
  videoId = '42d3d741-a1cf-427d-81d4-b23b2781e48e',
}) => {
  const [hlsUrl, setHlsUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://www.localhost:5000/api/v1/video/${videoId}`,
        )
        setHlsUrl(response.data.data.filePath)
      } catch (error) {
        console.error('Error fetching video data:', error)
      }
    }

    fetchVideo()
  }, [videoId])

  if (!hlsUrl) {
    return <p>Loading video...</p>
  }

  return <VideoPlayer hlsUrl={hlsUrl} />
}

export default App
