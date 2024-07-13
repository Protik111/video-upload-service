import httpStatus from 'http-status'
import { ILoginUser, ILoginUserResponse, IRegisterUser } from './auth.interface'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import prisma from '../../../shared/prisma'
import { hashing } from '../../../helpers/hashing'
import { User } from '@prisma/client'
import { isUser } from '../../../shared/isUser'

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload

  const user = await isUser.findUserByEmail(email)

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Credentials')
  }

  if (
    typeof user !== 'boolean' &&
    user.password &&
    !(await hashing.isPasswordMatched(password, user.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Credentials')
  }

  //create access token & refresh token
  if (typeof user !== 'boolean') {
    const { id: userId } = user
    const accessToken = jwtHelpers.createToken(
      { userId, email },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    )

    const refreshToken = jwtHelpers.createToken(
      { userId, email },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
    )

    return {
      accessToken,
      refreshToken,
    }
  }

  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
  )
}

const registerUser = async (
  payload: IRegisterUser,
): Promise<Pick<User, 'email'>> => {
  const { firstName, lastName, email, password, role, gender } = payload

  const isUserExist = await isUser.isUserExists(email)

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
  }

  const hashedPassword = await hashing.generateHash(password)

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      gender,
    },
    select: {
      email: true,
    },
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to register user')
  }

  return user
}

export const AuthService = {
  loginUser,
  registerUser,
}
