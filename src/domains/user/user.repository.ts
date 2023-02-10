import { User, UserCreateProps } from './entities/user'
import { UserName } from './valueObjects/userName'
import { Id } from '@/shared/domains/id'

export interface UserRepository {
  save(userCreateProps: UserCreateProps): Promise<void>
  findByUserId(userId: Id): Promise<User>
  findByUserName(userName: UserName): Promise<User>
}
