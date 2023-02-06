import { randomUUID } from 'crypto'
import { addHours } from 'date-fns'
import { injectable } from 'inversify'
import { Brackets } from 'typeorm'
import {
  AuthRepository,
  AuthRepositoryLoginProps,
  AuthRepositorySignUpProps
} from '@/domains/auth/auth.repository'
import { User, UserStatuses } from '@/domains/user/entities/user'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import {
  SessionModel,
  SessionModelUserIdUQKey,
  UserAuthModel,
  UserModel
} from '@/shared/infrastructure/typeorm/models'
import { cryptoCreateHash } from '@/shared/libs/cryptoCreateHash'

/**
 * MEMO
 * signupの責務を負いすぎ問題
 * ・重複確認
 * ・user生成→永続化
 * ・auth系生成→永続化
 */
@injectable()
export class TypeOrmAuthRepository implements AuthRepository {
  async login(props: AuthRepositoryLoginProps): Promise<void> {
    const { userId, password } = props
    await appDataSource.transaction(async (em) => {
      try {
        const selectedUsrAuth = await em
          .createQueryBuilder()
          .select('hash')
          .addSelect('salt')
          .from(UserAuthModel, 'u_a')
          .where({ userId })
          .getRawOne<Pick<UserAuthModel, 'hash' | 'salt'>>()
        if (!selectedUsrAuth) {
          throw new Error('incorrect userId')
        }
        const { hash, salt } = selectedUsrAuth
        const reCreatedHash = cryptoCreateHash(password, salt)
        if (hash !== reCreatedHash) {
          throw new Error('incorrect password')
        }

        await em
          .createQueryBuilder()
          .insert()
          .orUpdate(['session_id', 'expired_at'], SessionModelUserIdUQKey)
          .into(SessionModel)
          .values({
            userId,
            sessionId: randomUUID(),
            expiredAt: addHours(new Date(), 1)
          })
          .execute()
      } catch (err) {
        throw err
      }
    })
  }
  async signup(props: AuthRepositorySignUpProps): Promise<User> {
    let response: User = undefined
    await appDataSource.transaction(async (em) => {
      try {
        const { password, userName, emailAddress, telephoneNumber } = props
        // 重複確認
        const existsUser = await em
          .createQueryBuilder(UserModel, 'u')
          .where(
            new Brackets((qb) => {
              qb.where({ userName: userName.value })
                .orWhere({ emailAddress: emailAddress.value })
                .orWhere({ telephoneNumber: telephoneNumber.value })
            })
          )
          .andWhere({ userStatusName: UserStatuses.ACTIVE })
          .getExists()
        if (existsUser) {
          throw new Error('already exists user')
        }

        const newUser = User.create({ userName, emailAddress, telephoneNumber })
        const { userId } = await em.getRepository(UserModel).save(
          UserModel.build({
            userId: newUser.id,
            userStatusName: UserStatuses.ACTIVE,
            userName: newUser.userName.value,
            emailAddress: newUser.emailAddress.value,
            telephoneNumber: newUser.telephoneNumber.value
          })
        )

        const salt = randomUUID()
        const hash = cryptoCreateHash(password, salt)
        await em.getRepository(UserAuthModel).save(UserAuthModel.build({ userId, salt, hash }))

        response = newUser
      } catch (err) {
        throw err
      }
    })

    return response
  }
}
