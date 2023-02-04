import { TaskItem, TaskItemCreateProps } from './taskItem'
import { TaskLabel } from './taskLabel'
import { TaskStatus } from './taskStatus'
import { Entity } from '@/shared/domains/entity'
import { Id } from '@/shared/domains/id'
import { createUUId } from '@/shared/libs/createId'

export type TaskProps = {
  assignedUserId: Id
  taskItems: TaskItem[]
  taskLabels: TaskLabel[]
  taskName: string
  taskStatus: TaskStatus
  expiredOn: Date
  startedAt: Date
}

export type TaskCreateProps = Omit<TaskProps, 'taskItems' | 'taskLabels'> &
  Partial<Pick<TaskProps, 'taskLabels' | 'assignedUserId'>>

export class Task extends Entity<TaskProps> {
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
      throw new Error('task name error')
    }
    if (this.props.expiredOn.getTime() > this.props.startedAt.getTime()) {
      throw new Error('expiredOn > startedAt')
    }
  }
}
