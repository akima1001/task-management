import { User, UserCreateProps, UserStatuses } from '@/domains/user/entities/user'
import { UserRepository } from '@/domains/user/userRepository'
import { Id } from '@/shared/domains/id'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import { UserModel, UserStatusModel } from '@/shared/infrastructure/typeorm/models'

export class TypeORMUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await appDataSource.transaction(async (em) => {
      // TODO: 既存ユーザの確認
      await em.save(user)
    })
  }
  async find(userId: Id): Promise<User> {
    let activeUserModel: UserModel = undefined
    await appDataSource.transaction(async (em) => {
      try {
        const targetUserSubQuery = em
          .createQueryBuilder()
          .subQuery()
          .from(UserModel, 'u')
          .where({ userId })

        activeUserModel = await em
          .createQueryBuilder()
          .from(targetUserSubQuery.getQuery(), 't_u')
          .innerJoin(
            UserStatusModel,
            'u_s',
            `
            u_s.user_status_name = ${UserStatuses.ACTIVE}
            `
          )
          .setParameters(targetUserSubQuery.getParameters())
          .getRawOne()
      } catch (err) {
        throw err
      }
    })
    if (!activeUserModel) {
      throw new Error('not found active user')
    }

    return UserModel.toDomain(activeUserModel)
  }
  async exists(userCreateProps: UserCreateProps): Promise<{ exists: boolean }> {
    const { userName, emailAddress, telephoneNumber } = userCreateProps
    let exists: boolean = undefined
    await appDataSource.transaction(async (em) => {
      try {
        const duplicatedUserSubQuery = em
          .createQueryBuilder()
          .subQuery()
          .from(UserModel, 'u')
          .where({ userName })
          .orWhere({ emailAddress })
          .orWhere({ telephoneNumber })
        exists = await em
          .createQueryBuilder()
          .from(duplicatedUserSubQuery.getQuery(), 'd_u')
          .innerJoin(
            UserStatusModel,
            'u_s',
            `
            u_s.user_status_name = ${UserStatuses.ACTIVE}
            `
          )
          .setParameters(duplicatedUserSubQuery.getParameters())
          .getExists()
      } catch (err) {
        throw err
      }
    })

    return { exists }
  }
}
