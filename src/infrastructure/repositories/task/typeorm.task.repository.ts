import { Task } from '@/domains/task/entities/task'
import { TaskRepository } from '@/domains/task/taskRepository'

export class TypeOrmTaskRepository implements TaskRepository {
  async save(_task: Task): Promise<void> {
    throw new Error('unimplemented')
  }
}
