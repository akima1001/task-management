import { Task } from './entities/task'
import { TaskLabel } from './entities/taskLabel'
import { TaskStatus } from './entities/taskStatus'
import { Id } from '@/shared/domains/id'

export interface TaskRepository {
  save(task: Task): Promise<void>
  saveTaskLabel(taskLabel: TaskLabel): Promise<void>
  findTaskLabels(taskLabelIds: Id[]): Promise<TaskLabel[]>
  findTaskStatus(taskStatusId: Id): Promise<TaskStatus>
}
