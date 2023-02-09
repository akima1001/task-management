import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

export type TaskStatusModelProps = Pick<TaskStatusModel, 'taskStatusId' | 'taskStatusName'>

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
}
