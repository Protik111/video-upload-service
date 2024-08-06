import React, { useEffect, useState, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current
      const player = (playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{ src, type: 'application/x-mpegURL' }],
      }))

      player.on('ready', () => {
        console.log('Player is ready')
      })

      player.on('error', error => {
        console.error('Player error:', error)
      })
    } else {
      const player = playerRef.current
      player.src({ src, type: 'application/x-mpegURL' })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
      }
    }
  }, [src])

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
    </div>
  )
}

const App = () => {
  const [videoUrl, setVideoUrl] = useState('')

  console.log('videoURL', videoUrl)

  useEffect(() => {
    const fetchVideoUrl = async () => {
      // Replace with your API endpoint
      const response = await fetch(
        `http://www.localhost:5000/api/v1/video/5b39b9dc-659e-4872-9967-9c541c04844f`,
      )
      const data = await response.json()
      setVideoUrl(data.data.filePath)
    }

    fetchVideoUrl()
  }, [])

  return (
    <div>
      <h1>Video Player</h1>
      {videoUrl ? <VideoPlayer src={videoUrl} /> : <p>Loading video...</p>}
    </div>
  )
}

export default App
