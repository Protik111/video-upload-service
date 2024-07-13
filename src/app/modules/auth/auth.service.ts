import httpStatus from 'http-status'
import { ILoginUser, ILoginUserResponse, IRegisterUser } from './auth.interface'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import prisma from '../../../shared/prisma'
import { hashing } from '../../../helpers/hashing'
import { User } from '@prisma/client'

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { firstName, lastName, email, password } = payload

  // creating instance of User
  const user = new User()
  // access to our instance methods
  const isUserExist = await user.isUserExist(id)

  // const isUserExist = await User.isUserExist(id)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  //create access token & refresh token

  const { id: userId, role, needsPasswordChange } = isUserExist
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  }
}

const registerUser = async (
  payload: IRegisterUser,
): Promise<Pick<User, 'email'>> => {
  const { firstName, lastName, email, password } = payload

  const isUserExist = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
  }

  const hashedPassword = await hashing.generateHash(password)

  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashedPassword },
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
