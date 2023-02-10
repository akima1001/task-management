import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'
import { createUUId } from '@/shared/libs/createId'

export const DefaultTaskStatues = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
  ARCHIVE: 'ARCHIVE'
} as const
export type TaskStatusProps = {
  taskStatusName: string
}
export type TaskStatusCreateProps = TaskStatusProps

export type TaskStatusReconstructProps = TaskStatusCreateProps & {
  taskStatusId: Id
  createdAt?: Date
}

export class TaskStatus extends Entity<TaskStatusCreateProps> {
  get taskStatusName(): string {
    return this.props.taskStatusName
  }
  static create(props: TaskStatusCreateProps): TaskStatus {
    return new TaskStatus({ id: createUUId(), props })
  }
  static reconstruct(props: TaskStatusReconstructProps) {
    const { taskStatusId, createdAt, ...other } = props

    return new TaskStatus({
      id: taskStatusId,
      createdAt,
      props: { ...other }
    })
  }
  validate(): void {
    if (this.props.taskStatusName.length > 16) {
      throw new Error('taskStatusName length over 16')
    }
  }
}
