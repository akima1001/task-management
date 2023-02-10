import clone from 'clone'
import { User, UserCreateProps, UserStatuses, UserStatusType } from '@/domains/user/entities/user'
import { UserRepository } from '@/domains/user/user.repository'
import { UserName } from '@/domains/user/valueObjects/userName'
import { Id } from '@/shared/domains/id'

export class InMemoryUserRepository implements UserRepository {
  users: Map<Id, User> = new Map<Id, User>()
  // TODO: userStatusの状態も確かめる
  userStatusList: Map<Id, UserStatusType> = new Map<Id, UserStatusType>()

  save(user: User): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.users.set(user.id, this.cloneObject(user))
        this.userStatusList.set(user.id, UserStatuses.ACTIVE)
        resolve()
      }, 1000)
    })
  }
  findByUserName(_userName: UserName): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = this.users.get('')
        if (!foundUser) {
          reject(new Error('not found user'))
        }
        resolve(this.cloneObject(foundUser))
      }, 1000)
    })
  }
  findByUserId(userId: Id): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = this.users.get(userId)
        if (!foundUser) {
          reject(new Error('not found user'))
        }
        resolve(this.cloneObject(foundUser))
      }, 1000)
    })
  }
  exists(userCreateProps: UserCreateProps): Promise<{ exists: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { userName, emailAddress, telephoneNumber } = userCreateProps
        const activeUsers: User[] = []
        Array.from(this.users.keys())
          .filter((key) => this.userStatusList.get(key) === UserStatuses.ACTIVE)
          .forEach((key) => activeUsers.push(this.users.get(key)))
        const exists = activeUsers.some(
          (val) =>
            val.userName.equals(userName) ||
            val.emailAddress.equals(emailAddress) ||
            val.telephoneNumber.equals(telephoneNumber)
        )
        resolve({ exists })
      }, 1000)
    })
  }
  private cloneObject(user: User): User {
    return clone(user)
  }
}
