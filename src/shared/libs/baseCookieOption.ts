import { CookieOptions } from 'express'

export const baseCookieOption: CookieOptions = {
  httpOnly: true,
  secure: true
}
