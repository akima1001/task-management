import { randomUUID } from 'crypto'
import clone from 'clone'
import {
  AuthRepository,
  AuthRepositoryLoginProps,
  AuthRepositorySignUpProps
} from '@/domains/auth/auth.repository'
import { User, UserStatuses, UserStatusType } from '@/domains/user/entities/user'
import { Id } from '@/shared/domains/id'
import { UserAuthModelProps } from '@/shared/infrastructure/typeorm/models'
import { cryptoCreateHash } from '@/shared/libs/cryptoCreateHash'
import { LoginUserCaseDTO } from '@/useCases/shared/auth/login/login.dto'

export type UserAuth = UserAuthModelProps
type UserId = Id

export class InMemoryAuthRepository implements AuthRepository {
  UserAuthList: Map<UserId, UserAuth> = new Map<UserId, UserAuth>()
  Users: Map<Id, User> = new Map<Id, User>()
  UserStatusList: Map<Id, UserStatusType> = new Map<Id, UserStatusType>()

  login(_props: AuthRepositoryLoginProps): Promise<LoginUserCaseDTO> {
    throw new Error('Method not implemented.')
  }
  signup(props: AuthRepositorySignUpProps): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { password, ...userCreateProps } = props
        const newUser = User.create(userCreateProps)
        this.Users.set(newUser.id, clone(newUser))
        this.UserStatusList.set(newUser.id, UserStatuses.ACTIVE)

        const salt = randomUUID()
        const hash = cryptoCreateHash(password, salt)
        this.UserAuthList.set(newUser.id, { userId: newUser.id, hash, salt })

        resolve(newUser)
      }, 1000)
    })
  }
}
