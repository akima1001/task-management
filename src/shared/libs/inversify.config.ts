import { Container } from 'inversify'
import { INVERSIFY_TYPES } from './inversify.types'
import { AuthRepository } from '@/domains/auth/auth.repository'
import { TypeOrmAuthRepository } from '@/infrastructure/repositories/auth/typeorm.auth.repository'

export const container = new Container()
container.bind<AuthRepository>(INVERSIFY_TYPES.AuthRepository).to(TypeOrmAuthRepository)
