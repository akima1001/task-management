import { inject, injectable } from 'inversify'
import { Task } from '@/domains/task/entities/task'
import { TaskLabel } from '@/domains/task/entities/taskLabel'
import { TaskRepository } from '@/domains/task/task.repository'
import { TASK_TYPES } from '@/shared/libs/inversify.types'

export type CreateTaskUseCaseProps = {
  taskLabels?: string[]
  assignedUserIds: string[]
  // TODO: session情報から取得する
  createdUserId: string
  taskName: string
  taskStatusId: string
  expiredOn: Date
  startedAt: Date
}

@injectable()
export class CreateTaskUseCase {
  private readonly taskRepository: TaskRepository

  constructor(@inject(TASK_TYPES.TaskRepository) taskRepository: TaskRepository) {
    this.taskRepository = taskRepository
  }

  async execute(props: CreateTaskUseCaseProps) {
    // TaskLabelの取得
    let taskLabels: TaskLabel[] = undefined
    if (props.taskLabels?.length) {
      taskLabels = await this.taskRepository.findTaskLabels(props.taskLabels)
    }
    // TaskStatusの取得
    const taskStatus = await this.taskRepository.findTaskStatus(props.taskStatusId)
    const newTask = Task.create({
      taskLabels: taskLabels,
      assignedUserIds: props.assignedUserIds,
      createdUserId: props.createdUserId,
      taskName: props.taskName,
      taskStatus,
      expiredOn: props.expiredOn,
      startedAt: props.startedAt
    })
    await this.taskRepository.save(newTask)
  }
}
