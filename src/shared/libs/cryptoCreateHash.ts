import { createHash } from 'crypto'

export const cryptoCreateHash = (password: string, salt: string): string => {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex')
}
