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
import { TaskItemModel } from './TaskItem.model'

export type TasksTaskItemModelProps = Pick<TasksTaskItemModel, 'taskId'>

const taskIdKey: keyof Pick<TasksTaskItemModel, 'taskId'> = 'taskId'
const taskItemIdKey: keyof Pick<TasksTaskItemModel, 'taskItemId'> = 'taskItemId'
@Entity()
export class TasksTaskItemModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskId: string
  @ManyToOne(() => TaskModel, (taskModel) => taskModel.taskId)
  @JoinColumn({ name: snakeCase(taskIdKey) })
  taskModel: TaskModel

  @Column('uuid')
  taskItemId: string
  @ManyToOne(() => TaskItemModel, (taskItemModel) => taskItemModel.taskItemId)
  @JoinColumn({ name: snakeCase(taskItemIdKey) })
  taskItemModel: TaskItemModel

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  static build = (props: TasksTaskItemModelProps) => TasksTaskItemModel.create({ ...props })
}
