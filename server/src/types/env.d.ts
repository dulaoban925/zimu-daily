/**
 * process.env 类型声明
 */

/**
 * 解决 ts 「TS2669: 全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中」 错误
 * 使当前文件成为模块
 */
export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROT: string
      HTTP_HOST: string
      NODE_ENV: string
    }
  }
}
