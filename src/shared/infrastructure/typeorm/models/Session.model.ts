import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'
import { UserModel } from './User.model'

export type SessionModelProps = Pick<SessionModel, 'SessionId' | 'userId' | 'expiredAt'>

@Entity()
@Unique(['userId'])
export class SessionModel extends BaseEntity {
  @PrimaryColumn('uuid')
  SessionId: string

  @Column('uuid')
  userId: string
  @ManyToOne(() => UserModel, (userModel) => userModel.userId)
  @JoinColumn({ name: snakeCase('userId') })
  userModel: UserModel

  @Column({ type: 'timestamp with time zone' })
  expiredAt: Date

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  static build = (props: SessionModelProps) => SessionModel.create({ ...props })
}
