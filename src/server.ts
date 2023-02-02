import express from 'express'
import { boot } from './presentations/app'

const startServer = (app: express.Express) => {
  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`start server port ${process.env.EXPRESS_PORT}`)
  })
}

boot().then((app) => {
  startServer(app)
})
