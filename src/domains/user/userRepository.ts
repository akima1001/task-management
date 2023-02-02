import { User, UserCreateProps } from './entities/user'
import { Id } from '@/shared/domains/id'

export interface UserRepository {
  save(user: User): Promise<void>
  find(userId: Id): Promise<{ user: User }>
  exists(userCreateProps: UserCreateProps): Promise<{ exists: boolean }>
  // delete(user: User): void
}
