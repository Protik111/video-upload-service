export type ILoginUser = {
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
