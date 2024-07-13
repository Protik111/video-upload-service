import bcrypt from 'bcrypt'

const generateHash = async (
  payload: string,
  saltRound: number = 10,
): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRound)
  return bcrypt.hash(payload, salt)
}

const isPasswordMatched = async (
  raw: string,
  hash: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(raw, hash)
  return result
}

export const hashing = {
  generateHash,
  isPasswordMatched,
}
