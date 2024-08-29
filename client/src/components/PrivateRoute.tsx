import Cookies from 'js-cookie'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ element }: { element: ReactNode }) => {
  const token = Cookies.get('user-cred')

  return token ? element : <Navigate to="/login" />
}

export default PrivateRoute
