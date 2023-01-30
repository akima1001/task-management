import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { AppDataSource } from '../typeorm/dataSource'
import { errorHandler } from './middleware/errorHandler'
import router from './routes/routes'

AppDataSource.initialize()
  .then(() => {
    console.log('dataSource initialized')
  })
  .catch((err) => console.log(`db init error: ${err}`))

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

export default app
