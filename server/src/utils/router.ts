import express, { NextFunction, Request, Response } from 'express'
import { ZiMu } from 'zimu'
import { v4 as uuidV4 } from 'uuid'
import { ZiMuError } from './error'
import logger from './logger'

interface ResponseResult {
  code: number
  data: any
  total?: number // 总数据量
  totalPages?: number // 总页数
  page?: number // 当前页
  pageSize?: number // 当前页数据量
  message?: string // 错误信息
}

const SUCCESS_CODE = 200

const SERVER_ERROR_CODE = 500

const isInsert = (req: Request) =>
  req.method === 'POST' && req.path.endsWith('/insert')

const isUpdate = (req: Request) =>
  req.method === 'PUT' && req.path.endsWith('/updateById')

const isQueryByPage = (req: Request) =>
  req.method === 'GET' && req.path.endsWith('ByPage')

const isQueryList = (req: Request) =>
  req.method === 'GET' && req.path.endsWith('List')

const returnSuccess = (req: Request, data: any) => {
  const result: ResponseResult = {
    code: SUCCESS_CODE,
    data: [],
  }
  /**
   * 分页场景路由处理函数返回数据结构：
   * {
   *  total: number, // 总数据量
   *  totalPages: number, // 总页数
   *  page: number, // 当前页
   *  pageSize: number, // 当前页数据量
   *  data: any[] // 当前页数据
   * }
   *
   * 全量查询场景路由处理函数返回数据结构：
   * {
   *  total: number, // 总数据量
   *  data: any[] // 所有数据列表
   * }
   */
  if (isQueryByPage(req) || isQueryList(req)) {
    Object.assign(result, {
      ...data,
    })
  } else {
    Object.assign(result, {
      data,
    })
  }

  return result
}

const returnFail = (res: Response, e: ZiMuError | Error) => {
  let result: ResponseResult
  // 记录错误日志
  logger.error(e.message)
  if (e instanceof ZiMuError) {
    result = {
      code: e.code,
      message: e.message,
      data: null,
    }
  } else {
    result = {
      code: SERVER_ERROR_CODE,
      message: '服务器内部错误',
      data: null,
    }
  }

  return result
}

// 路由访问优先触发中间件
const routeBeforeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: 后续添加用户认证
  // 插入默认值设置
  if (isInsert(req)) {
    req.body.id = uuidV4()
    req.body.createdBy = 'admin'
    req.body.updatedBy = 'admin'
  }
  // 更新默认值设置
  if (isUpdate(req)) {
    req.body.updatedBy = 'admin'
  }
  next()
}

const routeHandlerDecorator = (
  handler: (params: any, req: Request, res: Response) => any
) => {
  return async (req: Request, res: Response) => {
    let result: any
    /**
     * try/catch 捕获路由处理错误
     * 所有错误一律抛出
     */
    try {
      if (!handler) {
        throw new Error('路由处理函数未定义')
      }
      let params: any = {}
      if (req.method === 'GET') {
        params = req.query
        if (isQueryByPage(req)) {
          params.page = parseInt(req.query.page as string, 10) || 1
          params.pageSize = parseInt(req.query.pageSize as string, 10) || 10
        }
      } else {
        params = req.body
      }
      result = await handler(params, req, res)
      result = returnSuccess(req, result)
    } catch (e) {
      result = returnFail(res, e as ZiMuError | Error)
    }

    res.send(result)
  }
}

// 生成带拦截器的 router
export function generateRouterWithInterceptor(routes: ZiMu.RouteDefine[]) {
  const router = express.Router()
  router.use(routeBeforeMiddleware)
  if (routes.length) {
    for (const { path, method, handler } of routes) {
      router[method ?? 'get'](path, routeHandlerDecorator(handler))
    }
  }

  return router
}
