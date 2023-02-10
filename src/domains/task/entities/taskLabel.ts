import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'
import { createUUId } from '@/shared/libs/createId'

export type TaskLabelProps = {
  taskLabelName: string
}
export type TaskLabelCreateProps = TaskLabelProps
export type TaskLabelReconstructProps = { id: Id; props: TaskLabelProps; createdAt?: Date }

export class TaskLabel extends Entity<TaskLabelProps> {
  get taskLabelName(): string {
    return this.props.taskLabelName
  }
  static create(props: TaskLabelCreateProps): TaskLabel {
    return new TaskLabel({ id: createUUId(), props })
  }
  static reconstruct(props: TaskLabelReconstructProps) {
    return new TaskLabel(props)
  }
  validate(): void {
    if (this.props.taskLabelName.length > 32) {
      throw new Error('taskLabelName length error')
    }
  }
}
