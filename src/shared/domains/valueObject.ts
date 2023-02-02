import { shallowEqualObjects } from 'shallow-equal'
import { Guard } from '@/shared/utils/guard'

export abstract class ValueObject<T> {
  protected readonly props: T

  constructor(props: T) {
    this.validateProps(props)
    this.validate(props)
    this.props = Object.freeze(props)
  }
  protected abstract validate(props: T): void
  private validateProps(props: T): void {
    if (Guard.isEmpty(props)) {
      throw new Error('value object should not empty')
    }
  }
  equals(vo: ValueObject<T>): boolean {
    if (!vo) {
      return false
    }

    return shallowEqualObjects(vo.props, this.props)
  }
}
