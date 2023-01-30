import { DataSource } from 'typeorm'
import * as Models from './models'
import { TypeOrmNamingStrategy } from './typeOrmNamingStrategy'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.T_ORM_HOST,
  port: Number(process.env.T_ORM_PORT),
  username: process.env.T_ORM_USERNAME,
  password: process.env.T_ORM_PASSWORD,
  database: process.env.T_ORM_DATABASE,
  synchronize: true,
  dropSchema: true,
  logging: false,
  //   entities: ['ormEntities/**/*.model.{ts,js}'],
  entities: Models,
  uuidExtension: 'pgcrypto',
  namingStrategy: new TypeOrmNamingStrategy()
})
