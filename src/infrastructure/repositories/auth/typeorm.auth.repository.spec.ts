import { randomUUID } from 'crypto'
import { TypeOrmAuthRepository } from './typeorm.auth.repository'
import { AuthRepositoryLoginProps, AuthRepositorySignUpProps } from '@/domains/auth/auth.repository'
import { User, UserStatuses } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import { SessionModel, UserStatusModel } from '@/shared/infrastructure/typeorm/models'

describe('typeorm auth repository', () => {
  beforeAll(async () => {
    try {
      await appDataSource.initialize()
      await appDataSource.transaction(async (em) => {
        await em
          .getRepository(UserStatusModel)
          .save(UserStatusModel.build({ userStatusName: UserStatuses.ACTIVE }))
      })
    } catch (err) {
      console.error(`during data source: ${err}`)
    }
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

    const newUser = await new TypeOrmAuthRepository().signup(authRepositorySignUpProps)

    user = newUser
    expect(user).toBeDefined()
  })
  it('duplicatedUser', async () => {
    const duplicatedUserNameProps: AuthRepositorySignUpProps = {
      password,
      userName,
      emailAddress: new EmailAddress({ value: 'hoge@hoge.com' }),
      telephoneNumber: new TelephoneNumber({ value: '1234567890' })
    }

    const duplicatedUserNamePromise = new TypeOrmAuthRepository().signup(duplicatedUserNameProps)
    await expect(duplicatedUserNamePromise).rejects.toThrow('already exists user')
  })
  type SessionId = Pick<SessionModel, 'sessionId'>
  let firstSession: SessionId = undefined
  it('login', async () => {
    const authRepositoryLoginProps: AuthRepositoryLoginProps = {
      userId: user.id,
      password
    }
    firstSession = await new TypeOrmAuthRepository().login(authRepositoryLoginProps)
    expect(firstSession.sessionId).toBeDefined()

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
  it('secondLogin', async () => {
    const authRepositoryLoginProps: AuthRepositoryLoginProps = {
      userId: user.id,
      password
    }
    const secondSession = await new TypeOrmAuthRepository().login(authRepositoryLoginProps)
    expect(firstSession.sessionId !== secondSession.sessionId).toBeTruthy()
  })
})
