import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'
import { TaskModel } from './Task.model'
import { TaskStatusModel } from './TaskStatus.model'

export type TasksTaskStatusModelProps = Pick<TasksTaskStatusModel, 'taskId' | 'taskStatusId'>

const taskIdKey: keyof Pick<TasksTaskStatusModel, 'taskId'> = 'taskId'
const taskStatusId: keyof Pick<TasksTaskStatusModel, 'taskStatusId'> = 'taskStatusId'
@Entity()
export class TasksTaskStatusModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskId: string
  @ManyToOne(() => TaskModel, (taskModel) => taskModel.taskId)
  @JoinColumn({ name: snakeCase(taskIdKey) })
  taskModel: TaskModel

  @PrimaryColumn('uuid')
  taskStatusId: string
  @ManyToOne(() => TaskStatusModel, (taskStatusModel) => taskStatusModel.taskStatusId)
  @JoinColumn({ name: snakeCase(taskStatusId) })
  taskStatusModel: TaskStatusModel

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  static build = (props: TasksTaskStatusModelProps) => TasksTaskStatusModel.create({ ...props })
}
