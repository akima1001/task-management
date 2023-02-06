import { InMemoryUserRepository } from './InMemory.user.repository'
import { User, UserCreateProps, UserStatuses } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'

describe('InMemoryUserRepository', () => {
  const userCreateProps: UserCreateProps = {
    userName: new UserName({ value: 'test' }),
    emailAddress: new EmailAddress({ value: 'test@test.com' }),
    telephoneNumber: new TelephoneNumber({ value: '00000000000' })
  }
  it('save', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()
    const user = User.create(userCreateProps)
    await inMemoryUserRepository.save(user)
    expect(inMemoryUserRepository.users.size).toBe(1)
  })
  it('find', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()
    const user = User.create(userCreateProps)
    await inMemoryUserRepository.save(user)
    const foundUser = await inMemoryUserRepository.findByUserId(user.id)
    expect(foundUser).toEqual(user)
  })
  it('exists', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()
    const user = User.create(userCreateProps)
    await inMemoryUserRepository.save(user)
    const { exists: existsActive } = await inMemoryUserRepository.exists(userCreateProps)
    expect(existsActive).toBe(true)

    inMemoryUserRepository.userStatusList.set(user.id, UserStatuses.LEAVED)
    const { exists: existsLeaved } = await inMemoryUserRepository.exists(userCreateProps)
    expect(existsLeaved).toBe(false)
  })
})
