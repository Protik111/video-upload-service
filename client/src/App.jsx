import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VideoPlayer from './components/VideoPlayer'

const App = ({ videoId }) => {
  const [hlsUrl, setHlsUrl] = useState(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://www.localhost:5000/api/v1/video/ca108827-e22c-4063-b5a9-1568f61d52c1`,
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
