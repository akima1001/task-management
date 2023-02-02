import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    res.status(500).send(err.message)
  } else {
    res.status(500).send('something error')
  }
}
