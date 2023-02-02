import { Task } from '@/domains/task/entities/task'
import { TaskRepository } from '@/domains/task/taskRepository'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'

export class TypeOrmTaskRepository implements TaskRepository {
  async save(_task: Task): Promise<void> {
    const queryRunner = appDataSource.createQueryRunner()
    try {
      await queryRunner.startTransaction()

      // task永続化
      // activityHistory永続化
    } catch (err) {
      await queryRunner.rollbackTransaction()
    }
  }
}
