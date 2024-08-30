export type IUplaodVideo = {
  title: string
  description: string
  filePath: string | Express.Multer.File | undefined
  userId: string
}

export type IUploadResponse = {
  id: string
  title: string
  description: string
  filePath: string
  createdAt: Date
}

export type IFielPath = {
  filePath: string
}

type IVideo = {
  id: string
  title: string
  description: string
  filePath: string
  createdAt: Date
  userId: string
}

export type IVideoResponse = {
  videos: IVideo[]
}
