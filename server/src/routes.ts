import { Express } from 'express'
import fs from 'fs'
import path from 'path'

// router 目录
const ROUTER_RELATIVE_PATH = './routers'

// 设置 router
export const setRouters = (app: Express) => {
  const routerFiles = fs.readdirSync(path.join(__dirname, ROUTER_RELATIVE_PATH))
  if (routerFiles.length > 0) {
    // 这里取得是编译后的文件，文件名包括 xxxx.js 及 xxxx.js.map(若 ts 输出 sourcemap)，此处取文件名去重
    const filePaths = new Set(routerFiles.map((file) => file.split('.')[0]))
    filePaths.forEach(async (filePath) => {
      const module = await import(
        path.join(__dirname, ROUTER_RELATIVE_PATH, filePath)
      )
      app.use(`/${filePath}`, module.default)
    })
  }
}
