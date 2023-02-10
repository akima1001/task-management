import { EntityManager } from 'typeorm'
import { appDataSource } from '../infrastructure/typeorm/dataSource'
import {
  TaskLabelModel,
  TaskStatusModel,
  UserModel,
  UserStatusModel
} from '../infrastructure/typeorm/models'
import { createUUId } from '../libs/createId'
import { TaskLabel } from '@/domains/task/entities/taskLabel'
import { DefaultTaskStatues } from '@/domains/task/entities/taskStatus'
import { User, UserCreateProps, UserStatuses } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'

export const TestUserUUID = '441d1740-770d-0ef1-22ae-d070389691a2'
export const setTypeOrmInitialValues = async (em: EntityManager) => {
  // User
  await em
    .getRepository(UserStatusModel)
    .save(UserStatusModel.build({ userStatusName: UserStatuses.ACTIVE }))

  const userCreateProps: UserCreateProps = {
    userName: new UserName({ value: 'test' }),
    emailAddress: new EmailAddress({ value: 'example@example.com' }),
    telephoneNumber: new TelephoneNumber({ value: '0000123456' })
  }
  const newUser = User.reconstruct({ userId: TestUserUUID, ...userCreateProps })
  await em.getRepository(UserModel).save(
    UserModel.build({
      userId: newUser.id,
      userStatusName: UserStatuses.ACTIVE,
      userName: newUser.userName.value,
      emailAddress: newUser.emailAddress.value,
      telephoneNumber: newUser.telephoneNumber.value
    })
  )
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

export const setupTypeOrmTest = {
  async start() {
    try {
      await appDataSource.initialize()

      /* 初期値を入れる */
      await appDataSource.transaction(async (em) => {
        await setTypeOrmInitialValues(em)
      })
    } catch (err) {
      console.error(`during data source: ${err}`)
    }
  },
  async stop() {
    await appDataSource.destroy()
  }
}
