import { randomUUID } from 'crypto'
import { TypeOrmAuthRepository } from './typeorm.auth.repository'
import {
  AuthRepositoryLoginProps,
  AuthRepositoryLogoutProps,
  AuthRepositorySignUpProps
} from '@/domains/auth/auth.repository'
import { User } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import { SessionModel } from '@/shared/infrastructure/typeorm/models'
import { container } from '@/shared/libs/inversify.config'
import { AUTH_TYPES, USER_TYPES } from '@/shared/libs/inversify.types'
import { setupTypeOrmTest, TestPassword, TestUserName } from '@/shared/test/test.setupTypeorm'
import { LoginUseCase } from '@/useCases/shared/auth/login/login.userCase'

describe('typeorm auth repository', () => {
  beforeAll(async () => {
    await setupTypeOrmTest.start()
  })
  afterAll(async () => {
    await setupTypeOrmTest.stop()
  })

  let user: User = undefined
  const password = 'password'
  const userName = new UserName({ value: 'spec' })
  const emailAddress = new EmailAddress({ value: 'spec@spec.com' })
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
  it('logout', async () => {
    const authRepositoryLoginProps: AuthRepositoryLoginProps = {
      userId: user.id,
      password
    }
    const { sessionId } = await new TypeOrmAuthRepository().login(authRepositoryLoginProps)
    const props: AuthRepositoryLogoutProps = {
      sessionId
    }
    const resolve = appDataSource.getRepository(SessionModel).findOneByOrFail({ sessionId })
    await expect(resolve).resolves.toBeDefined()

    await new TypeOrmAuthRepository().logout(props)
    const reject = appDataSource.getRepository(SessionModel).findOneByOrFail({ sessionId })
    await expect(reject).rejects.toThrow()
  })
  it('auth', async () => {
    await new LoginUseCase(
      container.get(AUTH_TYPES.AuthRepository),
      container.get(USER_TYPES.UserRepository)
    ).execute({
      userName: TestUserName,
      password: TestPassword
    })
    expect(1).toBe(1)
  })
})
