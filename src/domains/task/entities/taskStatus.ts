import { ulid } from 'ulid'
import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'

export type TaskStatusProps = {
  taskStatusId: Id
  taskStatusName: string
}

export type TaskStatusCreateProps = TaskStatusProps

export class TaskStatus extends Entity<TaskStatusProps> {
  static create(props: TaskStatusProps): TaskStatus {
    return new TaskStatus({ id: ulid(), props })
  }
  validate(): void {
    if (this.props.taskStatusName.length > 16) {
      throw new Error('taskStatusName length over 16')
    }
  }
}
