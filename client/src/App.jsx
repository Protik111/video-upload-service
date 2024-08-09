import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VideoPlayer from './components/VideoPlayer'

const App = ({ videoId }) => {
  const [hlsUrl, setHlsUrl] = useState(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://www.localhost:5000/api/v1/video/a292582d-5125-4e14-931d-b7e9d1328d39`,
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
