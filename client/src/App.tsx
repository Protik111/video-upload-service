import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import VideosUpload from './pages/VideosUpload'
import AllVideos from './pages/AllVideos'
import 'react-loading-skeleton/dist/skeleton.css'
import SingleVideo from './pages/SingleVideo'
import PrivateRoute from './components/PrivateRoute'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AllVideos />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/video-upload"
        element={<PrivateRoute element={<VideosUpload />} />}
      />
      <Route path="/videos" element={<AllVideos />} />
      <Route path="/video/:id" element={<SingleVideo />} />
    </Routes>
  )
}

export default App
