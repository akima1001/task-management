import { Request, Response } from 'express'
import { inject } from 'inversify'
import { AuthRepository } from '@/domains/auth/auth.repository'
import { UserRepository } from '@/domains/user/userRepository'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'
import { SignupUseCase, AuthSignupUseCaseProps } from '@/useCases/shared/auth/signup/signup.useCase'

type SignupResponse = {
  userId: string
  userName: string
  emailAddress: string
  telephoneNumber: string
}

export class AuthController {
  private readonly authRepository: AuthRepository
  private readonly userRepository: UserRepository

  constructor(@inject(INVERSIFY_TYPES.AuthRepository) authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
  async signup(req: Request, res: Response<SignupResponse>) {
    const user = await new SignupUseCase(this.authRepository).execute(
      req.body as AuthSignupUseCaseProps
    )

    res.send({
      userId: user.id,
      userName: user.userName.value,
      emailAddress: user.emailAddress.value,
      telephoneNumber: user.telephoneNumber.value
    })
  }
}
