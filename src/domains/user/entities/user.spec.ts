import { EmailAddress } from '../valueObjects/emailAddress'
import { TelephoneNumber } from '../valueObjects/telephoneNumber'
import { UserName } from '../valueObjects/userName'
import { User } from './user'
import { createUUId } from '@/shared/libs/createId'

describe('user.entity', () => {
  it('create', () => {
    const userName = new UserName({ value: 'userName' })
    const emailAddress = new EmailAddress({ value: 'email@email.com' })
    const telephoneNumber = new TelephoneNumber({ value: '0000000000' })
    const user = User.create({ userName, emailAddress, telephoneNumber })

    expect(user.userName).toStrictEqual(userName)
    expect(user.emailAddress).toStrictEqual(emailAddress)
    expect(user.telephoneNumber).toStrictEqual(telephoneNumber)
    expect(user.id).toBeDefined()
  })
  it('reconstruct', () => {
    const userId = createUUId()
    const userName = new UserName({ value: 'userName' })
    const emailAddress = new EmailAddress({ value: 'email@email.com' })
    const telephoneNumber = new TelephoneNumber({ value: '0000000000' })
    const now = new Date()
    const reconstructedUser = User.reconstruct(
      userId,
      {
        emailAddress,
        telephoneNumber,
        userName
      },
      now
    )

    expect(reconstructedUser.id).toStrictEqual(userId)
    expect(reconstructedUser.userName).toStrictEqual(userName)
    expect(reconstructedUser.emailAddress).toStrictEqual(emailAddress)
    expect(reconstructedUser.telephoneNumber).toStrictEqual(telephoneNumber)
    expect(reconstructedUser.createdAt).toStrictEqual(now)
  })
})
