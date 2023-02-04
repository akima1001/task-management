import { Entity } from '@/shared/domains/entity'
import { createUUId } from '@/shared/libs/createId'

export const TaskItemStatuses = {
  PROGRESS: 'progress',
  COMPLETED: 'completed'
} as const
export type TaskItemStatusType = (typeof TaskItemStatuses)[keyof typeof TaskItemStatuses]
export type TaskItemProps = {
  taskItemName: string
  taskItemStatus: TaskItemStatusType
  expiredOn: Date
  startedAt: Date
}
export type TaskItemCreateProps = Omit<TaskItemProps, 'taskItemStatus'>

export class TaskItem extends Entity<TaskItemProps> {
  static create(props: TaskItemCreateProps): TaskItem {
    return new TaskItem({
      id: createUUId(),
      props: {
        ...props,
        taskItemStatus: TaskItemStatuses.PROGRESS
      }
    })
  }
  complete(): void {
    this.props.taskItemStatus = TaskItemStatuses.COMPLETED
  }
  returnToProgress(): void {
    this.props.taskItemStatus = TaskItemStatuses.PROGRESS
  }
  validate(): void {
    if (!this.props.taskItemName || this.props.taskItemName.length > 127) {
      throw new Error('TaskItem name error')
    }
    if (this.props.expiredOn.getTime() > this.props.startedAt.getTime()) {
      throw new Error('expiredOn > startedAt')
    }
  }
}
