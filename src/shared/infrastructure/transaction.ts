import { injectable } from 'inversify'
import { QueryRunner, DataSource } from 'typeorm'

export interface DataAccess {
  session: unknown
  connection: unknown
  connect(): Promise<void>
  startTransaction(): Promise<void>
  commitTransaction(): Promise<void>
  rollbackTransaction(): Promise<void>
  release(): Promise<void>
}

@injectable()
export class TypeOrmTransaction implements DataAccess {
  session: QueryRunner
  connection: DataSource
  constructor(dataSource: DataSource) {
    this.connection = dataSource
    this.session = this.connection.createQueryRunner()
  }
  connect(): Promise<void> {
    return this.session.connect()
  }
  startTransaction(): Promise<void> {
    return this.session.startTransaction()
  }
  commitTransaction(): Promise<void> {
    return this.session.commitTransaction()
  }
  rollbackTransaction(): Promise<void> {
    return this.session.rollbackTransaction()
  }
  release(): Promise<void> {
    return this.session.release()
  }
}
