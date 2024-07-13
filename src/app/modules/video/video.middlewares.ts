import path from 'path'
import multer, { StorageEngine } from 'multer'
import fs from 'fs'
import { Request, Express } from 'express'

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadsDir)
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

export default upload
