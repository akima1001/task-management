import 'dotenv/config'
import 'reflect-metadata'
import path from 'path'
import cors from 'cors'
import express from 'express'
import { middleware as openApiMiddleware } from 'express-openapi-validator'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler'
import router from './routes/routes'
import { UserStatuses } from '@/domains/user/entities/user'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import { UserStatusModel } from '@/shared/infrastructure/typeorm/models'

export const boot = async () => {
  await appDataSource.initialize().catch((err) => {
    console.error(`during data source: ${err}`)

    throw err
  })
  console.log(`data source initialized`)

  // TMP: UserStatus
  await appDataSource.transaction(async (em) => {
    await em
      .getRepository(UserStatusModel)
      .save(UserStatusModel.build({ userStatusName: UserStatuses.ACTIVE }))
      .catch((err) => {
        throw err
      })
  })

  const app = express()
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  )
  app.use(
    openApiMiddleware({
      apiSpec: path.join(__dirname, 'api.yml')
    })
  )
  app.use('/', router)
  app.use(errorHandler)

  return app
}
