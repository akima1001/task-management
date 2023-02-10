import { TaskItem, TaskItemCreateProps } from './taskItem'
import { TaskLabel } from './taskLabel'
import { TaskStatus } from './taskStatus'
import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'
import { createUUId } from '@/shared/libs/createId'

export type TaskProps = {
  assignedUserIds: Id[]
  createdUserId: Id
  taskItems: TaskItem[]
  taskLabels: TaskLabel[]
  taskName: string
  taskStatus: TaskStatus
  expiredOn: Date
  startedAt: Date
}

export type TaskCreateProps = Omit<TaskProps, 'taskItems' | 'taskLabels'> &
  Partial<Pick<TaskProps, 'taskLabels' | 'assignedUserIds'>>

export class Task extends Entity<TaskProps> {
  get assignedUserIds(): Id[] {
    return this.props.assignedUserIds
  }
  get createdUserId(): Id {
    return this.props.createdUserId
  }
  get taskLabels(): TaskLabel[] {
    return this.props.taskLabels
  }
  get taskItems(): TaskItem[] {
    return this.props.taskItems
  }
  get taskName(): string {
    return this.props.taskName
  }
  get taskStatus(): TaskStatus {
    return this.props.taskStatus
  }
  get expiredOn(): Date {
    return this.props.expiredOn
  }
  get startedAt(): Date {
    return this.props.startedAt
  }
  static create(props: TaskCreateProps): Task {
    const { taskLabels, ...other } = props

    return new Task({
      id: createUUId(),
      props: { ...other, taskItems: [], taskLabels: taskLabels || [] }
    })
  }
  addTaskItem(taskItemCreateProps: TaskItemCreateProps): void {
    const newTaskItem = TaskItem.create(taskItemCreateProps)
    this.props.taskItems.push(newTaskItem)
  }
  validate(): void {
    if (!this.props.taskName || this.props.taskName.length > 127) {
      throw new Error('task name length must be less than 127')
    }
    if (this.props.assignedUserIds.length > 16) {
      throw new Error('assigned user must be no more than 16')
    }
    if (this.props.taskItems.length > 32) {
      throw new Error('task items must be no more than 32')
    }
    if (this.props.expiredOn.getTime() < this.props.startedAt.getTime()) {
      throw new Error('expired date must be later than the started time')
    }
    if (this.props.taskLabels.length > 8) {
      throw new Error('task labels must be no more than 8')
    }
  }
}
