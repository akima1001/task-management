import { DataSource } from 'typeorm'
import { TypeOrmNamingStrategy } from './config/typeOrmNamingStrategy'
import * as Models from './models'

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.T_ORM_HOST,
  port: Number(process.env.T_ORM_PORT),
  username: process.env.T_ORM_USERNAME,
  password: process.env.T_ORM_PASSWORD,
  database: process.env.T_ORM_DATABASE,
  synchronize: process.env.NODE_ENV !== 'production',
  dropSchema: process.env.NODE_ENV !== 'production',
  logging: false,
  //   entities: ['ormEntities/**/*.model.{ts,js}'],
  entities: Models,
  uuidExtension: 'pgcrypto',
  namingStrategy: new TypeOrmNamingStrategy()
})
