import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from './components/VideoPlayer'
import { useRef } from 'react'

function App() {
  const playerRef = useRef(null)
  const videoLink =
    'http://localhost:5000/compressed-video/ad1589bd-e95b-48fa-9cfc-f2b95b808702/index.m3u8'

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: 'application/x-mpegURL',
      },
    ],
  }
  const handlePlayerReady = player => {
    playerRef.current = player

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }
  return (
    <>
      <div>
        <h1>Video player</h1>
      </div>
      <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
    </>
  )
}

export default App
