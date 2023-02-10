import { inject } from 'inversify'
import { TaskCreateProps } from '@/domains/task/entities/task'
import { TaskRepository } from '@/domains/task/task.repository'
import { TASK_TYPES } from '@/shared/libs/inversify.types'

export type CreateTaskLabelUseCaseProps = Omit<TaskCreateProps, 'taskItems'>

export class CreateTaskLabelUseCase {
  private readonly taskRepository: TaskRepository

  constructor(@inject(TASK_TYPES.CreateTaskLabelUseCase) taskRepository: TaskRepository) {
    this.taskRepository = taskRepository
  }

  async execute(_props: CreateTaskLabelUseCaseProps) {
    // await this.taskRepository.save(newTask)
  }
}
