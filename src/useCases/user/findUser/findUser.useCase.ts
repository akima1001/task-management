import { FindUserDTO } from './findUser.dto'
import { UserRepository } from '@/domains/user/user.repository'
import { Id } from '@/shared/domains/id'

export class FindUserUseCase {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(userId: Id): Promise<FindUserDTO> {
    return await this.userRepository.findByUserId(userId)
  }
}
