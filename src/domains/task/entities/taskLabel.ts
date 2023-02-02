import { ulid } from 'ulid'
import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'

export type TaskLabelProps = {
  TaskLabelId: Id
  TaskLabelName: string
}
export type TaskLabelCreateProps = TaskLabelProps

export class TaskLabel extends Entity<TaskLabelProps> {
  static create(props: TaskLabelCreateProps): TaskLabel {
    return new TaskLabel({ id: ulid(), props })
  }
  validate(): void {
    if (this.props.TaskLabelName.length > 64) {
      throw new Error('taskLabelName length error')
    }
  }
}
