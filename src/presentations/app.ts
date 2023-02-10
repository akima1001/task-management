import 'dotenv/config'
import 'reflect-metadata'
import path from 'path'
import cors from 'cors'
import express from 'express'
import { middleware as openApiMiddleware } from 'express-openapi-validator'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler'
import router from './routes/routes'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'
import { setTypeOrmInitialValues } from '@/shared/test/test.setupTypeorm'

export const boot = async () => {
  // TODO: 依存の解消
  await appDataSource.initialize().catch((err) => {
    console.error(`during data source: ${err}`)

    throw err
  })
  console.log(`data source initialized`)

  // TODO: 開発時のみ初期情報を入れる
  if (process.env.NODE_ENV !== 'production') {
    await appDataSource.transaction(async (em) => {
      await setTypeOrmInitialValues(em)
    })
  }

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
