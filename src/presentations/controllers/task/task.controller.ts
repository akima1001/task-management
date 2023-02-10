import { Request, Response } from 'express'
import { inject } from 'inversify'
import { TASK_TYPES } from '@/shared/libs/inversify.types'
import { CreateTaskUseCase, CreateTaskUseCaseProps } from '@/useCases/task/createTask.useCase'

export class TaskController {
  private readonly createTaskUseCase: CreateTaskUseCase
  constructor(@inject(TASK_TYPES.CreateTaskUseCase) createTaskUseCase: CreateTaskUseCase) {
    this.createTaskUseCase = createTaskUseCase
  }
  async createTask(req: Request, res: Response) {
    await this.createTaskUseCase.execute(req.body as CreateTaskUseCaseProps)
    res.send()
  }
}
