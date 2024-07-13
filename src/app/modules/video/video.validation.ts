import { z } from 'zod'

const uploadVideoZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Video title is required',
    }),
    description: z.string({
      required_error: 'Video description is required',
    }),
  }),
})

export const VideoValidation = {
  uploadVideoZodSchema,
}
