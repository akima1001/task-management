import { ValueObject } from '@/shared/domains/valueObject'

export type TelephoneNumberProps = {
  value: string
}
export class TelephoneNumber extends ValueObject<TelephoneNumberProps> {
  constructor(props: TelephoneNumberProps) {
    super(props)
  }
  get value(): string {
    return this.props.value
  }
  protected validate(_props: TelephoneNumberProps): void {
    return
  }
}
