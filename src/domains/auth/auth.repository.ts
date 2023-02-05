import { User, UserCreateProps } from '../user/entities/user'

export type SignUpProps = {
  password: string
}
export type AuthRepositorySignUpProps = SignUpProps & UserCreateProps
export type AuthRepositorySignUpResponse = User

export type AuthRepositoryLoginProps = { userId: string; password: string }

export interface AuthRepository {
  signup(props: AuthRepositorySignUpProps): Promise<User>
  login(props: AuthRepositoryLoginProps): Promise<void>
}
