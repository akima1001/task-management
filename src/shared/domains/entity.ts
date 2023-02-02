import { Id } from './id'
import { Guard } from '@/shared/utils/guard'

interface CreateEntityProps<T> {
  id: Id
  props: T
  createdAt?: Date
  // updatedAt?: Date
}
export abstract class Entity<EntityProps> {
  protected _id: Id
  protected _createdAt: Date
  protected readonly props: EntityProps

  constructor({ id, createdAt, props }: CreateEntityProps<EntityProps>) {
    this.validateProps(props)
    this._id = id
    this._createdAt = createdAt || new Date()
    this.props = props
    this.validate()
  }
  get id(): Id {
    return this._id
  }
  get createdAt(): Date {
    return this._createdAt
  }

  abstract validate(): void
  private validateProps(props: EntityProps): void {
    if (Guard.isEmpty(props)) {
      throw new Error('value object should not empty')
    }
  }
}
