import { NextFunction, Request, Response } from 'express'
import { CookieTypes } from '@/shared/presentations/cookieTypes'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const _session = req.cookies(CookieTypes.SESSION)
  next()
}
