import { injectable } from 'inversify'
import { Any } from 'typeorm'
import { Task } from '@/domains/task/entities/task'
import { TaskLabel } from '@/domains/task/entities/taskLabel'
import { TaskStatus } from '@/domains/task/entities/taskStatus'
import { TaskRepository } from '@/domains/task/task.repository'
import { Id } from '@/shared/domains/id'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import {
  TaskModelProps,
  TaskModel,
  TaskStatusModel,
  TasksTaskStatusModel,
  TaskAssignedUserModelProps,
  TaskAssignedUserModel,
  TasksTaskLabelModelProps,
  TasksTaskLabelModel,
  TaskLabelModel
} from '@/shared/infrastructure/typeorm/models'

@injectable()
export class TypeOrmTaskRepository implements TaskRepository {
  async save(task: Task): Promise<void> {
    const taskModelProps: TaskModelProps = {
      taskId: task.id,
      createdUserId: task.createdUserId,
      taskName: task.taskName,
      expiredOn: task.expiredOn,
      startedAt: task.startedAt
    }
    await appDataSource.transaction(async (em) => {
      // Task保存
      const savedTask = await em.getRepository(TaskModel).save(TaskModel.build(taskModelProps))
      // TaskStatus保存
      const foundTaskStatus = await em.getRepository(TaskStatusModel).findOneOrFail({
        select: {
          taskStatusId: true
        },
        where: {
          taskStatusName: task.taskStatus.taskStatusName
        }
      })
      if (!foundTaskStatus) {
        throw new Error(`not found ${task.taskStatus.taskStatusName}`)
      }
      await em.getRepository(TasksTaskStatusModel).save(
        TasksTaskStatusModel.build({
          taskId: savedTask.taskId,
          taskStatusId: foundTaskStatus.taskStatusId
        })
      )
      // AssignedTaskUser保存
      if (task.assignedUserIds.length) {
        const taskAssignedUserModelProps = Array.from(
          task.assignedUserIds,
          (userId): TaskAssignedUserModelProps => {
            return {
              taskId: savedTask.taskId,
              userId: userId
            }
          }
        )
        await em.getRepository(TaskAssignedUserModel).save(taskAssignedUserModelProps)
      }
      // TasksTaskLabel保存
      if (task.taskLabels.length) {
        const tasksTaskLabelModelProps = Array.from(
          task.taskLabels,
          (taskLabel): TasksTaskLabelModelProps => {
            return {
              taskId: task.id,
              taskLabelId: taskLabel.id
            }
          }
        )
        await em.getRepository(TasksTaskLabelModel).save(tasksTaskLabelModelProps)
      }
    })
  }
  saveTaskLabel(_taskLabel: TaskLabel): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async findTaskLabels(taskLabelIds: Id[]): Promise<TaskLabel[]> {
    const taskLabelModels = await appDataSource
      .getRepository(TaskLabelModel)
      .findBy({ taskLabelId: Any(taskLabelIds) })

    return Array.from(taskLabelModels, (val) =>
      TaskLabel.reconstruct({ id: val.taskLabelId, props: { taskLabelName: val.taskLabelName } })
    )
  }
  async findTaskStatus(taskStatusId: Id): Promise<TaskStatus> {
    const taskStatusModel = await appDataSource
      .getRepository(TaskStatusModel)
      .findOneBy({ taskStatusId })
    if (!taskStatusModel) {
      throw new Error('not found task status')
    }

    return TaskStatusModel.toDomain(taskStatusModel)
  }
}
