import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import router from './routes/routes'
import { appDataSource } from '@/shared/infrastructure/typeorm/dataSource'

export const boot = async () => {
  return appDataSource
    .initialize()
    .then(() => {
      console.log('data source initialized')

      const app = express()
      app.use(express.json())
      app.use(express.urlencoded({ extended: true }))
      app.use(
        cors({
          origin: true
          // credentials: true
        })
      )
      app.use('/', router)
      app.use(errorHandler)

      return app
    })
    .catch((err) => {
      console.log('err: during data source')

      throw err
    })
}
