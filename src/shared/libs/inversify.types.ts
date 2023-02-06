export const INVERSIFY_TYPES = {
  AuthRepository: Symbol.for('AuthRepository'),
  UserRepository: Symbol.for('UserRepository'),
  SignupUseCase: Symbol.for('SignupUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase')
} as const
