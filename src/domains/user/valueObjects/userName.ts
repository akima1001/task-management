import { ValueObject } from '@/shared/domains/valueObject'

type UserNameProps = {
  value: string
}
export class UserName extends ValueObject<UserNameProps> {
  constructor(userName: UserNameProps) {
    super(userName)
  }
  get value(): string {
    return this.props.value
  }
  protected validate(userName: UserNameProps): void {
    if (userName.value.length >= 127) {
      throw new Error('user name must 127')
    }
  }
}
