import { Request, Response } from 'express'
import { ZiMu } from 'zimu'

export interface BaseController {
  queryByPage: ZiMu.RouteServiceHandler
  queryList: ZiMu.RouteServiceHandler
  queryById: ZiMu.RouteServiceHandler
  insert: ZiMu.RouteServiceHandler
  updateById: ZiMu.RouteServiceHandler
  deleteById: ZiMu.RouteServiceHandler
}

/**
 * 基础 controller
 */
export default function useBaseController(service: any): BaseController {
  const queryByPage = async (params: any, req: Request, res: Response) => {
    return await service.queryByPage(params, req, res)
  }

  /**
   * 全量查询
   */
  const queryList = async (params: any, req: Request, res: Response) => {
    return await service.queryList(params, req, res)
  }

  /**
   * 新增
   */
  const insert = async (params: any, req: Request, res: Response) => {
    return await service.insert(params, req, res)
  }

  /**
   * 删除
   */
  const deleteById = async (params: any, req: Request, res: Response) => {
    return await service.deleteById(params, req, res)
  }

  /**
   * 修改
   */
  const updateById = async (params: any, req: Request, res: Response) => {
    return await service.updateById(params, req, res)
  }

  /**
   * id 查询详情
   */
  const queryById = async (params: any, req: Request, res: Response) => {
    return await service.queryById(params, req, res)
  }

  return {
    queryByPage,
    queryList,
    insert,
    deleteById,
    updateById,
    queryById,
  }
}
