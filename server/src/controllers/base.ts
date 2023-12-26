import { Request, Response } from 'express'

export interface BaseController {
  queryByPage: (req: Request, res: Response) => void
  queryList: (req: Request, res: Response) => void
  queryById: (req: Request, res: Response) => void
  insert: (req: Request, res: Response) => void
  updateById: (req: Request, res: Response) => void
  deleteById: (req: Request, res: Response) => void
}

/**
 * 基础 controller
 */
export default function useBaseController(service: any): BaseController {
  const queryByPage = async (req: Request, res: Response) => {
    return await service.queryByPage(req, res)
  }

  /**
   * 全量查询
   */
  const queryList = async (req: Request, res: Response) => {
    return await service.queryList(req, res)
  }

  /**
   * 新增
   */
  const insert = async (req: Request, res: Response) => {
    return await service.insert(req, res)
  }

  /**
   * 删除
   */
  const deleteById = async (req: Request, res: Response) => {
    return await service.deleteById(req, res)
  }

  /**
   * 修改
   */
  const updateById = async (req: Request, res: Response) => {
    return await service.updateById(req, res)
  }

  /**
   * id 查询详情
   */
  const queryById = async (req: Request, res: Response) => {
    return await service.queryById(req, res)
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
