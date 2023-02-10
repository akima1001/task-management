import { inject, injectable } from 'inversify'
import { LoginUserCaseDTO } from './login.dto'
import { AuthRepository } from '@/domains/auth/auth.repository'
import { UserRepository } from '@/domains/user/user.repository'
import { UserName } from '@/domains/user/valueObjects/userName'
import { AUTH_TYPES, USER_TYPES } from '@/shared/libs/inversify.types'

export type LoginUseCaseProps = {
  userName: string
  password: string
}

@injectable()
export class LoginUseCase {
  private readonly authRepository: AuthRepository
  private readonly userRepository: UserRepository
  constructor(
    @inject(AUTH_TYPES.AuthRepository) authRepository: AuthRepository,
    @inject(USER_TYPES.UserRepository) userRepository: UserRepository
  ) {
    this.authRepository = authRepository
    this.userRepository = userRepository
  }
  async execute(props: LoginUseCaseProps): Promise<LoginUserCaseDTO> {
    const { userName, password } = props
    const user = await this.userRepository.findByUserName(new UserName({ value: userName }))
    if (!user) {
      throw new Error('not found user')
    }
    const session = await this.authRepository.login({ userId: user.id, password })

    return new LoginUserCaseDTO({ userName: user.userName.value, sessionId: session.sessionId })
  }
}
