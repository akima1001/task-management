import { inject } from 'inversify'
import { AuthRepository, SignUpProps } from '@/domains/auth/auth.repository'
import { User } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'

export type AuthSignupUseCaseProps = SignUpProps & {
  userName: string
  emailAddress: string
  telephoneNumber: string
}

export class SignupUseCase {
  private readonly authRepository: AuthRepository
  constructor(@inject(INVERSIFY_TYPES.AuthRepository) authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
  async execute(req: AuthSignupUseCaseProps): Promise<User> {
    const { userName, emailAddress, telephoneNumber, ...signUpProps } = req

    // TODO: User作成とSignUpは責務を分けるべきだろう
    // そうすると結果整合性となるため、トランザクションを貼りたい
    const user = await this.authRepository.signup({
      userName: new UserName({ value: userName }),
      emailAddress: new EmailAddress({ value: emailAddress }),
      telephoneNumber: new TelephoneNumber({ value: telephoneNumber }),
      ...signUpProps
    })

    return user
  }
}
