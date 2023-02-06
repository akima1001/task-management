import { User, UserCreateProps } from './entities/user'
import { Id } from '@/shared/domains/id'

export interface UserRepository {
  save(userCreateProps: UserCreateProps): Promise<void>
  find(userId: Id): Promise<User>
}
