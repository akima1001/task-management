import { TaskProps } from '@/domains/task/entities/task'
import { TaskCreator } from '@/domains/task/services/taskCreator'

export class CreateTaskUseCase {
  taskCreator: TaskCreator

  constructor(taskCreator: TaskCreator) {
    this.taskCreator = taskCreator
  }

  async execute(taskProps: TaskProps) {
    this.taskCreator.create(taskProps)
  }
}
