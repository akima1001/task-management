import { randomUUID } from 'crypto'
import { addHours } from 'date-fns'
import { injectable } from 'inversify'
import { Brackets } from 'typeorm'
import {
  AuthRepository,
  AuthRepositoryLoginProps,
  AuthRepositoryLoginResponse,
  AuthRepositoryLogoutProps,
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
  async login(props: AuthRepositoryLoginProps): Promise<AuthRepositoryLoginResponse> {
    const { userId, password } = props
    let response: AuthRepositoryLoginResponse = undefined
    await appDataSource.transaction(async (em) => {
      const foundUserAuth = await em.findOne(UserAuthModel, {
        select: {
          hash: true,
          salt: true
        },
        where: {
          userId
        }
      })
      if (!foundUserAuth) {
        throw new Error('incorrect userId')
      }
      const { hash, salt } = foundUserAuth
      const reCreatedHash = cryptoCreateHash(password, salt)
      if (hash !== reCreatedHash) {
        throw new Error('incorrect password')
      }

      const { identifiers } = await em
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
      response = identifiers[0] as AuthRepositoryLoginResponse
    })

    return response
  }
  async signup(props: AuthRepositorySignUpProps): Promise<User> {
    let response: User = undefined
    await appDataSource.transaction(async (em) => {
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
    })

    return response
  }
  async logout(props: AuthRepositoryLogoutProps): Promise<void> {
    const { sessionId } = props
    await appDataSource
      .getRepository(SessionModel)
      .createQueryBuilder()
      .delete()
      .from(SessionModel, 's')
      .where({ sessionId })
      .execute()
  }
}
