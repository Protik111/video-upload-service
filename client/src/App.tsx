import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import VideosUpload from './pages/VideosUpload'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/video-upload" element={<VideosUpload />} />
      <Route path="/videos" element={<Login />} />
    </Routes>
  )
}

export default App
