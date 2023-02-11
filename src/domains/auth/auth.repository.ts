import { User, UserCreateProps } from '../user/entities/user'
import { Id } from '@/shared/domains/id'
import { SessionModel } from '@/shared/infrastructure/typeorm/models'

export type SignUpProps = {
  password: string
}
export type AuthRepositorySignUpProps = SignUpProps & UserCreateProps
export type AuthRepositorySignUpResponse = User

export type AuthRepositoryLoginProps = { userId: string; password: string }
export type AuthRepositoryLoginResponse = Pick<SessionModel, 'sessionId'>
export type AuthRepositoryLogoutProps = { sessionId: string }

export interface AuthRepository {
  signup(props: AuthRepositorySignUpProps): Promise<User>
  login(props: AuthRepositoryLoginProps): Promise<AuthRepositoryLoginResponse>
  logout(props: AuthRepositoryLogoutProps): Promise<void>
  auth(sessionId: Id): Promise<User>
}
