export type ILoginUser = {
  email: string
  password: string
}

export type IRegisterUser = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'user' | 'admin' | 'moderator'
  gender: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
}

export type IRegisterUserResponse = {
  email: string
}
