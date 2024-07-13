export type ILoginUser = {
  email: string
  password: string
}

export type IRegisterUser = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
  needsPasswordChange: boolean
}

export type IRegisterUserResponse = {
  email: string
}
