// services/videoService.js
import JSZip from 'jszip'

export const fetchAndExtractZip = async url => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch the ZIP file.')
    }
    const blob = await response.blob()
    const zip = await JSZip.loadAsync(blob)

    // Extract HLS playlist
    const playlistFile = zip.file('playlist.m3u8')
    if (!playlistFile) {
      throw new Error('No HLS playlist found in the ZIP file.')
    }
    const playlistBlob = await playlistFile.async('blob')
    const playlistUrl = URL.createObjectURL(playlistBlob)

    // Extract video segments
    const chunks = Object.keys(zip.files).filter(name =>
      name.startsWith('chunk_'),
    )
    const chunkUrls = await Promise.all(
      chunks.map(async chunkName => {
        const chunkBlob = await zip.file(chunkName).async('blob')
        return URL.createObjectURL(chunkBlob)
      }),
    )

    return { playlistUrl, chunkUrls }
  } catch (error) {
    console.error('Error fetching or extracting ZIP file:', error)
    throw error
  }
}
