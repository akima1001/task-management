import { EntityManager } from 'typeorm'
import { appDataSource } from '../infrastructure/typeorm/dataSource'
import { TaskLabelModel, TaskStatusModel, UserStatusModel } from '../infrastructure/typeorm/models'
import { createUUId } from '../libs/createId'
import { container } from '../libs/inversify.config'
import { AUTH_TYPES } from '../libs/inversify.types'
import { TaskLabel } from '@/domains/task/entities/taskLabel'
import { DefaultTaskStatues } from '@/domains/task/entities/taskStatus'
import { UserStatuses } from '@/domains/user/entities/user'
import { SignupUseCase } from '@/useCases/shared/auth/signup/signup.useCase'

export const TestUserUUID = '441d1740-770d-0ef1-22ae-d070389691a2'
export const setTypeOrmInitialValues = async (em: EntityManager) => {
  // User
  await em
    .getRepository(UserStatusModel)
    .save(UserStatusModel.build({ userStatusName: UserStatuses.ACTIVE }))
  // Task
  await em.getRepository(TaskStatusModel).save([
    { taskStatusId: createUUId(), taskStatusName: DefaultTaskStatues.TODO },
    { taskStatusId: createUUId(), taskStatusName: DefaultTaskStatues.DOING },
    { taskStatusId: createUUId(), taskStatusName: DefaultTaskStatues.DONE },
    { taskStatusId: createUUId(), taskStatusName: DefaultTaskStatues.ARCHIVE }
  ])
  const newTaskLabel = TaskLabel.create({ taskLabelName: 'test' })
  await em.getRepository(TaskLabelModel).save(
    TaskLabelModel.build({
      taskLabelId: newTaskLabel.id,
      taskLabelName: newTaskLabel.taskLabelName
    })
  )
}

export const TestUserName = 'userName'
export const TestPassword = 'password'
export const setupTypeOrmTest = {
  async start() {
    try {
      await appDataSource.initialize()

      /* 初期値を入れる */
      await appDataSource.transaction(async (em) => {
        await setTypeOrmInitialValues(em)
      })
      /* ユーザ作成 */
      const emailAddress = 'setup@setup.com'
      const telephoneNumber = '0000001234'
      await new SignupUseCase(container.get(AUTH_TYPES.AuthRepository)).execute({
        userName: TestUserName,
        password: TestPassword,
        emailAddress,
        telephoneNumber
      })
    } catch (err) {
      console.error(`during data source: ${err}`)
    }
  },
  async stop() {
    await appDataSource.destroy()
  }
}
