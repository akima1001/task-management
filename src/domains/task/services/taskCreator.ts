import { Task, TaskCreateProps } from '../entities/task'

export class TaskCreator {
  async create(taskCreateProps: TaskCreateProps): Promise<{ newTask: Task }> {
    const newTask = Task.create(taskCreateProps)

    return { newTask }
  }
}
