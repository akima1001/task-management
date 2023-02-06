import { Router, Request, Response } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { container } from '@/shared/libs/inversify.config'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'

const route = Router()

// TODO: WrapFuncをどうかぶせるか
route.post('/signup', (req: Request, res: Response) => {
  new AuthController(container.get(INVERSIFY_TYPES.AuthRepository)).signup(req, res)
})

export default route
