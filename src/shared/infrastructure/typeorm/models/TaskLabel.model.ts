import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

export type TaskLabelModelProps = Pick<TaskLabelModel, 'taskLabelId' | 'taskLabelName'>

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
}
