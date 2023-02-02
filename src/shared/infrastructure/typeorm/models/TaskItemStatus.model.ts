import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

export type TaskItemStatusModelProps = Pick<TaskItemStatusModel, 'taskItemStatusName'>

@Entity()
export class TaskItemStatusModel extends BaseEntity {
  @PrimaryColumn('varchar', { length: 16 })
  taskItemStatusName: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  static build = (props: TaskItemStatusModelProps) => TaskItemStatusModel.create({ ...props })
}
