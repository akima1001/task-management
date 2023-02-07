import { inject, injectable } from 'inversify'
import { AuthRepository, AuthRepositoryLogoutProps } from '@/domains/auth/auth.repository'
import { INVERSIFY_TYPES } from '@/shared/libs/inversify.types'

export type LogoutUseCaseProps = AuthRepositoryLogoutProps
@injectable()
export class LogoutUseCase {
  private readonly authRepository
  constructor(@inject(INVERSIFY_TYPES.AuthRepository) authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
  async execute(props: LogoutUseCaseProps) {
    await this.authRepository.logout(props)
  }
}
