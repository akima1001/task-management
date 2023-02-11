import { User } from '@/domains/user/entities/user'

declare global {
  namespace Express {
    interface Locals {
      currentUser?: User
    }
  }
}
