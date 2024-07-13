export type IUplaodVideo = {
  title: string
  description: string
  filePath: string | File | undefined
}

export type IUploadResponse = {
  id: string
  title: string
  description: string
  filePath: string
  createdAt: Date
}
