import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { TaskLabel } from '@/domains/task/entities/taskLabel'

export type TaskLabelModelProps = Pick<TaskLabelModel, 'taskLabelId' | 'taskLabelName'>

type taskLabelModelFields = TaskLabelModelProps & Pick<TaskLabelModel, 'createdAt' | 'updatedAt'>
@Entity()
export class TaskLabelModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskLabelId: string
  @Column('varchar', { length: 64 })
  taskLabelName: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: TaskLabelModelProps) => TaskLabelModel.create({ ...props })
  static toDomain = (taskLabelModel: taskLabelModelFields): TaskLabel => {
    const { taskLabelId, taskLabelName, createdAt } = taskLabelModel

    return TaskLabel.reconstruct({ id: taskLabelId, props: { taskLabelName }, createdAt })
  }
}
