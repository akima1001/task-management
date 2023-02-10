import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'
import { UserStatusModel } from './UserStatus.model'
import { User, UserProps } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'

export type UserModelProps = Pick<
  UserModel,
  'userId' | 'userStatusName' | 'userName' | 'emailAddress' | 'telephoneNumber'
>
export type UserModelFields = UserModelProps & Pick<UserModel, 'createdAt' | 'updatedAt'>

const userStatusNameKey: keyof Pick<UserModel, 'userStatusName'> = 'userStatusName'
@Entity()
export class UserModel extends BaseEntity {
  @PrimaryColumn('uuid')
  userId: string

  @Column('varchar', { length: 16 })
  userStatusName: string
  @ManyToOne(() => UserStatusModel, (userStatusModel) => userStatusModel.userStatusName)
  @JoinColumn({ name: snakeCase(userStatusNameKey) })
  userStatusModel: UserStatusModel

  @Column('varchar', { length: 128 })
  userName: string

  @Column('varchar', { length: 254 })
  emailAddress: string

  @Column('varchar', { length: 18 })
  telephoneNumber: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: UserModelProps) => UserModel.create({ ...props })
  static toDomain = (userModel: UserModelFields): User => {
    const { userId, userName, emailAddress, telephoneNumber, createdAt } = userModel
    const userProps: UserProps = {
      userName: new UserName({ value: userName }),
      emailAddress: new EmailAddress({ value: emailAddress }),
      telephoneNumber: new TelephoneNumber({ value: telephoneNumber })
    }

    return User.reconstruct({ userId, ...userProps, createdAt })
  }
}
