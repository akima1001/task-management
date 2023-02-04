import { User, UserCreateProps } from '../user/entities/user'

// TODO: typeはどこに置く
export type SignUpProps = {
  password: string
}
export type AuthRepositorySignUpProps = SignUpProps & UserCreateProps
export type AuthRepositorySignUpResponse = User

export type AuthRepositoryLoginProps = { userId: string; password: string }

export interface AuthRepository {
  signup(props: AuthRepositorySignUpProps): Promise<{ user: User }>
  login(props: AuthRepositoryLoginProps): Promise<void>
}
