import { InMemoryAuthRepository, UserAuth } from './inMemory.auth.repository'
import { SignUpProps } from '@/domains/auth/auth.repository'
import { User, UserCreateProps } from '@/domains/user/entities/user'
import { EmailAddress } from '@/domains/user/valueObjects/emailAddress'
import { TelephoneNumber } from '@/domains/user/valueObjects/telephoneNumber'
import { UserName } from '@/domains/user/valueObjects/userName'
import { cryptoCreateHash } from '@/shared/libs/cryptoCreateHash'

describe('inMemory auth repository', () => {
  it('signUp', async () => {
    const inMemoryAuthRepository = new InMemoryAuthRepository()
    const password = 'password'
    const signUpProps: SignUpProps = {
      password
    }
    const userName = new UserName({ value: 'username' })
    const emailAddress = new EmailAddress({ value: 'test@test.com' })
    const telephoneNumber = new TelephoneNumber({ value: '0000000000' })
    const userCreateProps: UserCreateProps = {
      userName,
      emailAddress,
      telephoneNumber
    }
    await inMemoryAuthRepository.signup({ ...signUpProps, ...userCreateProps })

    let newUser: User = undefined
    for (const user of inMemoryAuthRepository.Users.values()) {
      newUser = user
    }
    expect(newUser).toBeDefined()
    let newUserAuth: UserAuth = undefined
    for (const userAuth of inMemoryAuthRepository.UserAuthList.values()) {
      newUserAuth = userAuth
    }
    expect(newUserAuth.hash).toBe(cryptoCreateHash(password, newUserAuth.salt))
  })
})
