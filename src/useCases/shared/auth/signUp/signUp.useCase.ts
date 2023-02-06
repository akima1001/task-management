import { inject, injectable } from 'inversify'
import { SignupDTO } from './signup.dto'
import { AuthRepository, SignUpProps } from '@/domains/auth/auth.repository'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'

export type AuthSignupUseCaseProps = SignUpProps & {
  userName: string
  emailAddress: string
  telephoneNumber: string
}

@injectable()
export class SignupUseCase {
  private readonly authRepository: AuthRepository
  constructor(@inject(INVERSIFY_TYPES.AuthRepository) authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
  async execute(props: AuthSignupUseCaseProps): Promise<SignupDTO> {
    const { userName, emailAddress, telephoneNumber, password } = props

    /*
    MEMO
    ・アンチパターンの採用してでもトランザクションを貼るべきか
    ・貼るとすればどんな方法が良いか
    ・集約をまたがってしまっているので責務を分けるべきか
    */
    const user = await this.authRepository.signup({
      userName: new UserName({ value: userName }),
      emailAddress: new EmailAddress({ value: emailAddress }),
      telephoneNumber: new TelephoneNumber({ value: telephoneNumber }),
      password
    })

    const session = await this.authRepository.login({ userId: user.id, password })

    return new SignupDTO({
      userId: user.id,
      userName: user.userName.value,
      emailAddress: user.emailAddress.value,
      telephoneNumber: user.telephoneNumber.value,
      sessionId: session.sessionId
    })
  }
}
