import { RequestHandler, Request, Response, NextFunction } from 'express'

interface PromiseRequestHandler<T, U = Record<string, string>> {
  (req: Request<U>, res: Response<T>, next: NextFunction): Promise<unknown>
}

export const wrapHandler = <T, U>(func: PromiseRequestHandler<T, U>): RequestHandler<U> => {
  return (req, res, next): Promise<unknown> =>
    func(req, res, next).catch((err: unknown) => next(err || 'ERROR IS NULL OR UNDEFINED'))
}
