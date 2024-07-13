import { z } from 'zod'

const loginZodSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First Name is required',
      })
      .email('This is not a valid email'),
    lasttName: z.string({
      required_error: 'Last Name is required',
    }),
    email: z.string({
      required_error: 'Email Name is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

export const AuthValidation = {
  loginZodSchema,
}
