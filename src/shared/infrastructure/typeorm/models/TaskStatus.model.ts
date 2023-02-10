import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { TaskStatus } from '@/domains/task/entities/taskStatus'

export type TaskStatusModelProps = Pick<TaskStatusModel, 'taskStatusId' | 'taskStatusName'>
type TaskStatusFields = TaskStatusModelProps & Pick<TaskStatusModel, 'createdAt' | 'updatedAt'>

@Entity()
export class TaskStatusModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskStatusId: string

  @Column('varchar', { length: 16 })
  taskStatusName: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: TaskStatusModelProps) => TaskStatusModel.create({ ...props })
  static toDomain = (props: TaskStatusFields): TaskStatus => {
    const { taskStatusId, taskStatusName, createdAt } = props

    return TaskStatus.reconstruct({ taskStatusId, taskStatusName, createdAt })
  }
}
