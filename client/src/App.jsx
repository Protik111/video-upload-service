import './App.css'
import VPlayer from 'vnetwork-player'
import Hls from 'hls.js'
import 'vnetwork-player/dist/vnetwork-player.min.css'

function App() {
  return (
    <div>
      <VPlayer
        source="http://localhost:5000/vid"
        color="#ff0000"
        autoPlay
        Hls={Hls}
      />
    </div>
  )
}

export default App
