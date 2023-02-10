import { User, UserCreateProps } from '@/domains/user/entities/user'
import { UserRepository } from '@/domains/user/user.repository'

export class CreateUserUseCase {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(props: UserCreateProps): Promise<void> {
    const user = User.create(props)
    await this.userRepository.save(user)
  }
}
