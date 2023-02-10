import { addDays } from 'date-fns'
import { TypeOrmAuthRepository } from '../auth/typeorm.auth.repository'
import { TypeOrmTaskRepository } from './typeorm.task.repository'
import { Task, TaskCreateProps } from '@/domains/task/entities/task'
import { DefaultTaskStatues, TaskStatus } from '@/domains/task/entities/taskStatus'
import { User } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import {
  TaskAssignedUserModel,
  TaskLabelModel,
  TaskModel,
  TasksTaskLabelModel,
  TaskStatusModel
} from '@/shared/infrastructure/typeorm/models'
import { setupTypeOrmTest } from '@/shared/test/test.setupTypeorm'

describe('TypeOrmTaskRepository', () => {
  beforeAll(async () => {
    await setupTypeOrmTest.start()
  })
  afterAll(async () => {
    await setupTypeOrmTest.stop()
  })

  let user: User = undefined
  const password = 'password'
  const userName = new UserName({ value: 'userName' })
  const emailAddress = new EmailAddress({ value: 'test@test.com' })
  const telephoneNumber = new TelephoneNumber({ value: '0000000000' })
  it('setup', async () => {
    const newUser = await new TypeOrmAuthRepository().signup({
      password,
      userName,
      emailAddress,
      telephoneNumber
    })
    user = newUser
    expect(user).toBeDefined()
  })
  it('save', async () => {
    const taskStatusName = DefaultTaskStatues.TODO
    const { taskStatusId } = await appDataSource.getRepository(TaskStatusModel).findOne({
      select: {
        taskStatusId: true
      },
      where: {
        taskStatusName
      }
    })
    const taskLabelModel = await appDataSource
      .getRepository(TaskLabelModel)
      .findOne({ where: { taskLabelName: 'test' } })
    const reTaskLabel = TaskLabelModel.toDomain(taskLabelModel)
    const now = new Date()
    const taskCreateProps: TaskCreateProps = {
      assignedUserIds: [user.id],
      taskLabels: [reTaskLabel],
      createdUserId: user.id,
      taskName: 'taskName',
      taskStatus: TaskStatus.reconstruct({ taskStatusId, taskStatusName }),
      expiredOn: addDays(now, 7),
      startedAt: now
    }
    const newTask = Task.create(taskCreateProps)
    expect(newTask).toBeDefined()
    await new TypeOrmTaskRepository().save(newTask)
    const isSavedTask = await appDataSource
      .getRepository(TaskModel)
      .findOne({ where: { taskId: newTask.id } })
    expect(isSavedTask).toBeDefined()
    const taskAssignedUsers = await appDataSource
      .getRepository(TaskAssignedUserModel)
      .find({ where: { taskId: newTask.id } })
    expect(taskAssignedUsers).toHaveLength(1)
    const isSavedTasksTaskLabel = await appDataSource
      .getRepository(TasksTaskLabelModel)
      .find({ where: { taskId: newTask.id } })
    expect(isSavedTasksTaskLabel).toHaveLength(1)
  })
  it('save task label', () => {
    expect(1).toBe(2)
  })
})
