import { z } from 'zod'

const registerZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'First Name is required',
      })
      .email('This is not a valid email'),
    firstName: z.string({
      required_error: 'First Name is required',
    }),
    lastName: z.string({
      required_error: 'Last Name is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

export const AuthValidation = {
  registerZodSchema,
}
