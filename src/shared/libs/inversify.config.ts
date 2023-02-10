import { Container } from 'inversify'
import { AUTH_TYPES, TASK_TYPES, USER_TYPES } from './inversify.types'
import { AuthRepository } from '@/domains/auth/auth.repository'
import { TaskRepository } from '@/domains/task/task.repository'
import { UserRepository } from '@/domains/user/user.repository'
import { TypeOrmAuthRepository } from '@/infrastructure/repositories/auth/typeorm.auth.repository'
import { TypeOrmTaskRepository } from '@/infrastructure/repositories/task/typeorm.task.repository'
import { TypeORMUserRepository } from '@/infrastructure/repositories/user/typeorm.user.repository'
import { LoginUseCase } from '@/useCases/shared/auth/login/login.userCase'
import { LogoutUseCase } from '@/useCases/shared/auth/logout/logout.useCase'
import { SignupUseCase } from '@/useCases/shared/auth/signup/signup.useCase'
import { CreateTaskUseCase } from '@/useCases/task/createTask.useCase'

export const container = new Container()
container.bind<AuthRepository>(AUTH_TYPES.AuthRepository).to(TypeOrmAuthRepository)
container.bind<SignupUseCase>(AUTH_TYPES.SignupUseCase).to(SignupUseCase)
container.bind<LoginUseCase>(AUTH_TYPES.LoginUseCase).to(LoginUseCase)
container.bind<LogoutUseCase>(AUTH_TYPES.LogoutUseCase).to(LogoutUseCase)

container.bind<UserRepository>(USER_TYPES.UserRepository).to(TypeORMUserRepository)

container.bind<TaskRepository>(TASK_TYPES.TaskRepository).to(TypeOrmTaskRepository)
container.bind<CreateTaskUseCase>(TASK_TYPES.CreateTaskUseCase).to(CreateTaskUseCase)
