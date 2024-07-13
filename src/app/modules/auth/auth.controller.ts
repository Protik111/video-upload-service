import catchAsync from '../../../shared/catchAsync'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import config from '../../../config'
import sendResponse from '../../../shared/sendResponse'
import { ILoginUserResponse, IRegisterUserResponse } from './auth.interface'

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AuthService.loginUser(loginData)
  const { refreshToken } = result

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  })
})

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { ...registerData } = req.body
  const result = await AuthService.registerUser(registerData)

  sendResponse<IRegisterUserResponse>(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: result,
  })
})

export const AuthController = {
  loginUser,
  registerUser,
}
