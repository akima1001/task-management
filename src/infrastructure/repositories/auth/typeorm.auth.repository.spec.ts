import { randomUUID } from 'crypto'
import { TypeOrmAuthRepository } from './typeorm.auth.repository'
import { AuthRepositorySignUpProps } from '@/domains/auth/auth.repository'
import { User, UserStatuses } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import { SessionModel, UserStatusModel } from '@/shared/infrastructure/typeorm/models'

describe('typeorm auth repository', () => {
  beforeAll(async () => {
    await appDataSource.initialize().catch((err) => {
      console.error(`during data source: ${err}`)

      throw err
    })
    console.log('data source initialized')
    await appDataSource.transaction(async (em) => {
      await em
        .getRepository(UserStatusModel)
        .save(UserStatusModel.build({ userStatusName: UserStatuses.ACTIVE }))
        .catch((err) => {
          throw err
        })
    })
  })
  afterAll(async () => {
    await appDataSource.destroy()
  })

  let user: User = undefined
  const password = 'password'
  const userName = new UserName({ value: 'userName' })
  const emailAddress = new EmailAddress({ value: 'test@test.com' })
  const telephoneNumber = new TelephoneNumber({ value: '0000000000' })
  it('signUp', async () => {
    const authRepositorySignUpProps: AuthRepositorySignUpProps = {
      password,
      userName,
      emailAddress,
      telephoneNumber
    }

    const { user: newUser } = await new TypeOrmAuthRepository().signup(authRepositorySignUpProps)

    user = newUser
    expect(user).toBeDefined()
  })
  it('login', async () => {
    await new TypeOrmAuthRepository().login({
      userId: user.id,
      password
    })

    const result = await appDataSource
      .createQueryBuilder()
      .from(SessionModel, 's')
      .where({ userId: user.id })
      .getOne()
    expect(result).toBeDefined()

    const incorrectUserIdLoginPromise = new TypeOrmAuthRepository().login({
      userId: randomUUID(),
      password: password
    })
    await expect(incorrectUserIdLoginPromise).rejects.toThrow('incorrect userId')
    const incorrectPasswordLoginPromise = new TypeOrmAuthRepository().login({
      userId: user.id,
      password: 'incorrect password'
    })
    await expect(incorrectPasswordLoginPromise).rejects.toThrow('incorrect password')
  })
})
