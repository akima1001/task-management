import 'reflect-metadata'
import { addDays } from 'date-fns'
import { CreateTaskUseCase, CreateTaskUseCaseProps } from './createTask.useCase'
import { DefaultTaskStatues } from '@/domains/task/entities/taskStatus'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import {
  TaskAssignedUserModel,
  TaskLabelModel,
  TaskModel,
  TasksTaskLabelModel,
  TaskStatusModel,
  UserModel
} from '@/shared/infrastructure/typeorm/models'
import { container } from '@/shared/libs/inversify.config'
import { TASK_TYPES } from '@/shared/libs/inversify.types'
import { setupTypeOrmTest } from '@/shared/test/test.setupTypeorm'

describe('create task usecase', () => {
  beforeEach(async () => {
    await setupTypeOrmTest.start()
  })
  afterEach(async () => {
    await setupTypeOrmTest.stop()
  })

  it('execute TaskLabelなし', async () => {
    const { taskStatusId } = await appDataSource
      .getRepository(TaskStatusModel)
      .findOneBy({ taskStatusName: DefaultTaskStatues.TODO })
    const { userId } = await appDataSource.getRepository(UserModel).findOneBy({ userName: 'test' })
    const now = new Date()
    const taskName = 'test task name'
    const props: CreateTaskUseCaseProps = {
      assignedUserIds: [userId],
      createdUserId: userId,
      taskName,
      taskStatusId,
      expiredOn: addDays(now, 7),
      startedAt: now
    }
    await new CreateTaskUseCase(container.get(TASK_TYPES.TaskRepository)).execute(props)
    const foundTask = await appDataSource.getRepository(TaskModel).findOneBy({ taskName })
    expect(foundTask).toBeTruthy()
    const foundAssignedUser = await appDataSource
      .getRepository(TaskAssignedUserModel)
      .findOneBy({ taskId: foundTask.taskId })
    expect(foundAssignedUser).toBeTruthy()
  })
  it('execute TaskLabelあり', async () => {
    const { taskStatusId } = await appDataSource
      .getRepository(TaskStatusModel)
      .findOneBy({ taskStatusName: DefaultTaskStatues.TODO })
    const { userId } = await appDataSource.getRepository(UserModel).findOneBy({ userName: 'test' })
    const { taskLabelId } = await appDataSource
      .getRepository(TaskLabelModel)
      .findOneBy({ taskLabelName: 'test' })
    const now = new Date()
    const taskName = 'test task name'
    const props: CreateTaskUseCaseProps = {
      assignedUserIds: [userId],
      taskLabels: [taskLabelId],
      createdUserId: userId,
      taskName,
      taskStatusId,
      expiredOn: addDays(now, 7),
      startedAt: now
    }
    await new CreateTaskUseCase(container.get(TASK_TYPES.TaskRepository)).execute(props)
    const foundTasksTaskLabel = await appDataSource
      .getRepository(TasksTaskLabelModel)
      .findOneBy({ taskLabelId })
    expect(foundTasksTaskLabel).toBeTruthy()
  })
})
