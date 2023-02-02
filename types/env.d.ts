declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: string
        T_ORM_HOST?: string
        T_ORM_PORT?: string
        T_ORM_USERNAME?: string
        T_ORM_PASSWORD?: string
        T_ORM_DATABASE?: string
        EXPRESS_PORT?: string
      }
    }
  }
}
