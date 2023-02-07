import { Router, Request, Response, NextFunction } from 'express'
import { LoginController } from '../controllers/auth/login.controller'
import { LogoutController } from '../controllers/auth/logout.controller'
import { SignupController } from '../controllers/auth/signup.controller'
import { container } from '@/shared/libs/inversify.config'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'

const route = Router()

route.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  new LogoutController(container.get(INVERSIFY_TYPES.LogoutUseCase))
    .logout(req, res)
    .catch((err) => next(err))
})
route.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  new SignupController(container.get(INVERSIFY_TYPES.SignupUseCase))
    .signup(req, res)
    .catch((err) => next(err))
})
route.post('/login', (req: Request, res: Response, next: NextFunction) => {
  new LoginController(container.get(INVERSIFY_TYPES.LoginUseCase))
    .login(req, res)
    .catch((err) => next(err))
})

export default route
