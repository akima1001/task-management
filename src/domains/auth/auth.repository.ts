import { User, UserCreateProps } from '../user/entities/user'
import { SessionModel } from '@/shared/infrastructure/typeorm/models'

export type SignUpProps = {
  password: string
}
export type AuthRepositorySignUpProps = SignUpProps & UserCreateProps
export type AuthRepositorySignUpResponse = User

export type AuthRepositoryLoginProps = { userId: string; password: string }
export type AuthRepositoryLoginResponse = Pick<SessionModel, 'sessionId'>

export interface AuthRepository {
  signup(props: AuthRepositorySignUpProps): Promise<User>
  login(props: AuthRepositoryLoginProps): Promise<AuthRepositoryLoginResponse>
}
