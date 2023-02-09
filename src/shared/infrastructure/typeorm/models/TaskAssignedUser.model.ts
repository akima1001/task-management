import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'
import { TaskModel } from './Task.model'
import { UserModel } from './User.model'

export type TaskAssignedUserModelProps = Pick<TaskAssignedUserModel, 'taskId' | 'userId'>

const taskIdKey: keyof Pick<TaskAssignedUserModel, 'taskId'> = 'taskId'
const userIdKey: keyof Pick<TaskAssignedUserModel, 'userId'> = 'userId'
@Entity()
export class TaskAssignedUserModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskId: string
  @ManyToOne(() => TaskModel, (taskModel) => taskModel.taskId)
  @JoinColumn({ name: snakeCase(taskIdKey) })
  taskModel: TaskModel

  @Column('uuid')
  userId: string
  @ManyToOne(() => UserModel, (userModel) => userModel.userId)
  @JoinColumn({ name: snakeCase(userIdKey) })
  userModel: UserModel

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  static build = (props: TaskAssignedUserModelProps) => TaskAssignedUserModel.create({ ...props })
}
