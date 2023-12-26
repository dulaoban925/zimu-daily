import { Request, Response } from 'express'

/**
 * 请求处理相关类型
 */
export { ZiMu }

declare namespace ZiMu {
  interface PageQuery {
    page: number
    pageSize: number
  }

  interface RouteDefine {
    path: string
    method?: 'get' | 'post' | 'put' | 'delete'
    handler: (req: Request, res: Response) => void
  }
}
