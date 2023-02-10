import { EmailAddress } from '../valueObjects/emailAddress'
import { TelephoneNumber } from '../valueObjects/telephoneNumber'
import { UserName } from '../valueObjects/userName'
import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'
import { createUUId } from '@/shared/libs/createId'

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
export type UserReconstructProps = UserCreateProps & { userId: Id; createdAt?: Date }

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
  static reconstruct(props: UserReconstructProps) {
    const { userId, createdAt, ...other } = props

    return new User({ id: userId, createdAt, props: { ...other } })
  }
  static create(props: UserCreateProps, createdAt?: Date): User {
    const user = new User({
      id: createUUId(),
      props: { ...props },
      createdAt
    })

    return user
  }
  validate(): void {
    return
  }
}
