import { ValueObject } from '@/shared/domains/valueObject'

export type EmailAddressProps = {
  value: string
}
export class EmailAddress extends ValueObject<EmailAddressProps> {
  constructor(props: EmailAddressProps) {
    super(props)
  }
  get value(): string {
    return this.props.value
  }
  protected validate(_props: EmailAddressProps): void {
    return
  }
}
