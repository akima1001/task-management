import { ulid } from 'ulid'
import { EmailAddress } from '../valueObjects/emailAddress'
import { TelephoneNumber } from '../valueObjects/telephoneNumber'
import { UserName } from '../valueObjects/userName'
import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'

// TODO: どこに置くか考える
export const UserStatuses = {
  ACTIVE: 'active',
  LEAVED: 'leaved'
} as const
export type UserStatusType = (typeof UserStatuses)[keyof typeof UserStatuses]

export type UserProps = {
  userName: UserName
  emailAddress: EmailAddress
  telephoneNumber: TelephoneNumber
}

export type UserCreateProps = Omit<UserProps, 'userStatus'>

export class User extends Entity<UserProps> {
  get userName(): UserName {
    return this.props.userName
  }
  get emailAddress(): EmailAddress {
    return this.props.emailAddress
  }
  get telephoneNumber(): TelephoneNumber {
    return this.props.telephoneNumber
  }
  static reconstruct(id: Id, props: UserProps, createdAt?: Date) {
    return new User({ id, props, createdAt })
  }
  static create(props: UserCreateProps, createdAt?: Date): User {
    const user = new User({
      id: ulid(),
      props: { ...props },
      createdAt
    })

    return user
  }
  validate(): void {
    return
  }
}
