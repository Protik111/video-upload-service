import { ChangeEvent, useState } from 'react'
import { toast, Toaster } from 'sonner'
import useValidator from '../hooks/useValidator'
import axiosInstance from '../lib/axios'
import Spinner from '../components/ui/Spinner'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../components/shared/Header'

interface State {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [values, setValues] = useState<State>({
    email: 'rafiurprotik1111@gmail.com',
    password: '11111',
  })
  const [loading, setLoading] = useState(false)
  const { email, password } = values

  const { errors, validate } = useValidator()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const customMessages = {
      email: 'Email is required!',
      password: 'Password is required!',
    }
    const { isError } = validate(
      {
        email,
        password,
      },
      customMessages,
    )

    if (!isError) {
      setLoading(true)

      try {
        const response = await axiosInstance.post('/auth/login', {
          email,
          password,
        })

        if (response?.data?.statusCode === 200) {
          Cookies.set('user-cred', response?.data?.data?.accessToken)
          setTimeout(() => {
            navigate('/')
          }, 500)
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ data?: { message: string } }>
        if (error) {
          console.log(error)
          toast.error(
            axiosError?.response?.data?.data?.message ??
              'Error on sign in. Try again!',
          )
        } else {
          toast.error('An unexpected error occurred.')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="main_content mt-[4.2rem] py-10">
      <Header />
      <div className="container">
        <div className="form_wrapper px-6 py-10 lg:py-12 xl:py-15">
          <form className="max-w-28rem mx-auto mb-0" onSubmit={handleLogin}>
            <div className="form-title text-center">
              <h1 className="text-2xl font-semibold mb-2 leading-none">
                Login
              </h1>
              Login using your email and password
            </div>
            <br />

            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                Email Address
                <span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => handleChange(e)}
              />
              {errors?.email && (
                <span className="text-red-600 text-sm">{errors?.email}</span>
              )}
            </div>

            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                Password
                <span className="text-red-600"> *</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => handleChange(e)}
              />
              {errors?.password && (
                <span className="text-red-600 text-sm">{errors?.password}</span>
              )}
            </div>

            <div className="form-group mt-4">
              <button
                type="submit"
                className="btn-dark-full relative text-regular"
              >
                {loading ? <Spinner /> : 'Sign in'}
              </button>

              {/* Error toaster */}
              <Toaster position="top-center" richColors />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
