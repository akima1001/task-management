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
import { UserModel } from './User.model'

export type TaskModelProps = Pick<
  TaskModel,
  'taskId' | 'createdUserId' | 'taskName' | 'expiredOn' | 'startedAt'
>

const createdUserIdKey: keyof Pick<TaskModel, 'createdUserId'> = 'createdUserId'
@Entity()
export class TaskModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskId: string

  @Column('uuid')
  createdUserId: string
  @ManyToOne(() => UserModel, (userModel) => userModel.userId)
  @JoinColumn({ name: snakeCase(createdUserIdKey) })
  createdUserModel: UserModel

  @Column('varchar', { length: 255 })
  taskName: string

  @Column('date')
  expiredOn: Date

  @Column({ type: 'timestamp with time zone' })
  startedAt: Date

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: TaskModelProps) => TaskModel.create({ ...props })
}
