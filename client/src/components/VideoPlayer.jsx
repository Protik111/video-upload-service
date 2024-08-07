import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'

const VideoPlayer = ({ hlsUrl }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data)
      })

      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    } else {
      console.error('HLS is not supported')
    }
  }, [hlsUrl])

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', height: 'auto' }}
        playsInline
      />
    </div>
  )
}

export default VideoPlayer
