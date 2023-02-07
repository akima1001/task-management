import { Request, Response } from 'express'
import { inject } from 'inversify'
import { baseCookieOption } from '@/shared/libs/baseCookieOption'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'
import { CookieTypes } from '@/shared/presentations/cookieTypes'
import { LoginUserCaseDTO } from '@/useCases/shared/auth/login/login.dto'
import { LoginUseCaseProps, LoginUseCase } from '@/useCases/shared/auth/login/login.userCase'

type LoginRequest = LoginUseCaseProps
type LoginResponse = Omit<LoginUserCaseDTO, 'sessionId'>

export class LoginController {
  private readonly loginUseCase: LoginUseCase

  constructor(@inject(INVERSIFY_TYPES.LoginUseCase) loginUseCase: LoginUseCase) {
    this.loginUseCase = loginUseCase
  }
  async login(req: Request, res: Response<LoginResponse>) {
    const { sessionId, userName } = await this.loginUseCase.execute(req.body as LoginRequest)

    res.cookie(CookieTypes.SESSION, sessionId, baseCookieOption)

    res.send({ userName })
  }
}
