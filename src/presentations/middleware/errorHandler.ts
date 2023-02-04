import { Request, Response, NextFunction } from 'express'
import { HttpError } from 'express-openapi-validator/dist/framework/types'

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status || 500).send(err.message)
    console.error(err.stack)
  } else if (err instanceof Error) {
    res.status(500).send(err.message)
    console.error(err.stack)
  } else {
    res.status(500).send('something error')
  }
}
