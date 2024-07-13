import { z } from 'zod'

const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'First Name is required',
      })
      .email('This is not a valid email'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

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
    role: z.string({
      required_error: 'Role Name is required',
    }),
    gender: z.string({
      required_error: 'Last Name is required',
    }),
  }),
})

export const AuthValidation = {
  registerZodSchema,
  loginZodSchema,
}
