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
import { TaskItemStatusModel } from './TaskItemStatus.model'

export type TaskItemModelProps = Pick<
  TaskItemModel,
  'taskItemId' | 'taskItemStatusName' | 'taskItemName' | 'expiredOn' | 'startedAt'
>

const taskItemStatusNameKey: keyof Pick<TaskItemModel, 'taskItemStatusName'> = 'taskItemStatusName'
@Entity()
export class TaskItemModel extends BaseEntity {
  @PrimaryColumn('uuid')
  taskItemId: string

  @Column('varchar', { length: 16 })
  taskItemStatusName: string
  @ManyToOne(
    () => TaskItemStatusModel,
    (taskItemStatusModel) => taskItemStatusModel.taskItemStatusName
  )
  @JoinColumn({ name: snakeCase(taskItemStatusNameKey) })
  taskItemStatusModel: TaskItemStatusModel

  @Column('varchar', { length: 64 })
  taskItemName: string

  @Column('date')
  expiredOn: Date

  @Column({ type: 'timestamp with time zone' })
  startedAt: Date

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  static build = (props: TaskItemModelProps) => TaskItemModel.create({ ...props })
}
