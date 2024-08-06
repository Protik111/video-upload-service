// App.js
import React, { useState, useEffect } from 'react'
import VideoPlayer from './components/VideoPlayer' // Adjust import path as needed
import { fetchAndExtractZip } from './utils/fetchAndExtractZip'

function App() {
  const [playlistUrl, setPlaylistUrl] = useState(null)
  const [error, setError] = useState(null)
  const videoUrl =
    'https://res.cloudinary.com/dukinbgee/raw/upload/v1722942935/myak39uwevm9fwcykfpm.zip' // Your ZIP URL

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { playlistUrl } = await fetchAndExtractZip(videoUrl)
        setPlaylistUrl(playlistUrl)
      } catch (error) {
        setError('Failed to load video.')
      }
    }

    fetchVideo()
  }, [videoUrl])

  if (error) {
    return <div>{error}</div>
  }

  if (!playlistUrl) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Video player</h1>
      <VideoPlayer
        options={{
          sources: [{ src: playlistUrl, type: 'application/x-mpegURL' }],
        }}
      />
    </div>
  )
}

export default App
