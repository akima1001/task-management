import { Container } from 'inversify'
import { INVERSIFY_TYPES } from './inversify.types'
import { AuthRepository } from '@/domains/auth/auth.repository'
import { UserRepository } from '@/domains/user/userRepository'
import { TypeOrmAuthRepository } from '@/infrastructure/repositories/auth/typeorm.auth.repository'
import { TypeORMUserRepository } from '@/infrastructure/repositories/user/typeorm.user.repository'
import { LoginUseCase } from '@/useCases/shared/auth/login/login.userCase'
import { LogoutUseCase } from '@/useCases/shared/auth/logout/logout.useCase'
import { SignupUseCase } from '@/useCases/shared/auth/signup/signup.useCase'

export const container = new Container()
container.bind<AuthRepository>(INVERSIFY_TYPES.AuthRepository).to(TypeOrmAuthRepository)
container.bind<UserRepository>(INVERSIFY_TYPES.UserRepository).to(TypeORMUserRepository)

container.bind<SignupUseCase>(INVERSIFY_TYPES.SignupUseCase).to(SignupUseCase)
container.bind<LoginUseCase>(INVERSIFY_TYPES.LoginUseCase).to(LoginUseCase)
container.bind<LogoutUseCase>(INVERSIFY_TYPES.LogoutUseCase).to(LogoutUseCase)
