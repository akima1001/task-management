import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'
import { UserModel } from './User.model'

export type UserAuthModelProps = Pick<UserAuthModel, 'userId' | 'hash' | 'salt'>

const userIdKey: keyof Pick<UserAuthModel, 'userId'> = 'userId'
@Entity()
export class UserAuthModel extends BaseEntity {
  @PrimaryColumn('uuid')
  userId: string
  @OneToOne(() => UserModel, (userModel) => userModel.userId)
  @JoinColumn({ name: snakeCase(userIdKey) })
  userModel: UserModel

  @Column('varchar', { length: 255 })
  hash: string

  @Column('varchar', { length: 64 })
  salt: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: UserAuthModelProps) => UserAuthModel.create({ ...props })
}
