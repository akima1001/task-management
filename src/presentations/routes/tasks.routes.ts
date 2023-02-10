import { Router, Request, Response, NextFunction } from 'express'
import { TaskController } from '../controllers/task/task.controller'
import { container } from '@/shared/libs/inversify.config'
import { TASK_TYPES } from '@/shared/libs/inversify.types'

const route = Router()

route.post('/', (req: Request, res: Response, next: NextFunction) => {
  new TaskController(container.get(TASK_TYPES.CreateTaskUseCase))
    .createTask(req, res)
    .catch((err) => next(err))
})
// route.post('/tasklabel',(req: Request))

export default route
