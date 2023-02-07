export const USER_TYPES = {
  UserRepository: Symbol.for('UserRepository')
} as const

export const AUTH_TYPES = {
  SignupUseCase: Symbol.for('SignupUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  AuthRepository: Symbol.for('AuthRepository')
} as const
