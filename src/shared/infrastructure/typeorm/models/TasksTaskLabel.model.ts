import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'
import { TaskModel } from './Task.model'
import { TaskLabelModel } from './TaskLabel.model'

export type TasksTaskLabelModelProps = Pick<TasksTaskLabelModel, 'taskId' | 'taskLabelId'>

const taskIdKey: keyof Pick<TasksTaskLabelModel, 'taskId'> = 'taskId'
const taskLabelIdKey: keyof Pick<TasksTaskLabelModel, 'taskLabelId'> = 'taskLabelId'
@Entity()
export class TasksTaskLabelModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskId: string
  @ManyToOne(() => TaskModel, (taskModel) => taskModel.taskId)
  @JoinColumn({ name: snakeCase(taskIdKey) })
  taskModel: TaskModel

  @PrimaryColumn('uuid')
  taskLabelId: string
  @ManyToOne(() => TaskLabelModel, (taskLabelModel) => taskLabelModel.taskLabelId)
  @JoinColumn({ name: snakeCase(taskLabelIdKey) })
  taskLabelModel: TaskLabelModel

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: TasksTaskLabelModelProps) => TasksTaskLabelModel.create({ ...props })
}
