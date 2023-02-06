import { Request, Response } from 'express'
import { inject } from 'inversify'
import { baseCookieOption } from '@/shared/libs/baseCookieOption'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'
import { CookieTypes } from '@/shared/presentations/cookieTypes'
import { SignupDTO } from '@/useCases/shared/auth/signup/signup.dto'
import { SignupUseCase, AuthSignupUseCaseProps } from '@/useCases/shared/auth/signup/signup.useCase'

export type SignupResponse = Omit<SignupDTO, 'sessionId'>

export class SignupController {
  private readonly signupUserCase: SignupUseCase

  constructor(@inject(INVERSIFY_TYPES.SignupUseCase) signupUseCase: SignupUseCase) {
    this.signupUserCase = signupUseCase
  }
  async signup(req: Request, res: Response<SignupResponse>) {
    const signupUserCaseResponse = await this.signupUserCase.execute(
      req.body as AuthSignupUseCaseProps
    )
    const { sessionId, ...response } = signupUserCaseResponse

    res.cookie(CookieTypes.SESSION, sessionId, baseCookieOption)

    res.send(response)
  }
}
