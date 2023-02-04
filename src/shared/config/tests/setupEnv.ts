export default (): void => {
  process.env.NODE_ENV = 'test'

  process.env.T_ORM_HOST = 'localhost'
  process.env.T_ORM_PORT = '11002'
  process.env.T_ORM_USERNAME = 'postgres'
  process.env.T_ORM_PASSWORD = 'password'
  process.env.T_ORM_DATABASE = 'local_tm'

  return
}
