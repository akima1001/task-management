import { Request, Response } from 'express'
import { inject } from 'inversify'
import { baseCookieOption } from '@/shared/libs/baseCookieOption'
import { AUTH_TYPES } from '@/shared/libs/inversify.types'
import { CookieTypes } from '@/shared/presentations/cookieTypes'
import { LogoutUseCase, LogoutUseCaseProps } from '@/useCases/shared/auth/logout/logout.useCase'

type LogoutRequest = LogoutUseCaseProps
export class LogoutController {
  private readonly logoutUseCase: LogoutUseCase
  constructor(@inject(AUTH_TYPES.LogoutUseCase) logoutUseCase: LogoutUseCase) {
    this.logoutUseCase = logoutUseCase
  }
  async logout(req: Request, res: Response) {
    await this.logoutUseCase.execute(req.body as LogoutRequest)

    // TODO: optionを合致させる必要があるか
    res.clearCookie(CookieTypes.SESSION, baseCookieOption)

    res.send({ msg: 'completed logout' })
  }
}
