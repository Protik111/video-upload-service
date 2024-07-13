import { User } from '@prisma/client'
import prisma from './prisma'

const isUserExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  return user ? true : false
}

const findUserByEmail = async (email: string): Promise<User | boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  return user ? user : false
}

export const isUser = {
  isUserExists,
  findUserByEmail,
}
