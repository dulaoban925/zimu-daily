import { ZiMu } from 'zimu'
import reminderItemController from '../controllers/reminder-item'
import { generateRouterWithInterceptor } from '../utils/router'

const {
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
  batchDelete,
  batchMove,
} = reminderItemController

// 所有路由
export const routes: ZiMu.RouteDefine[] = [
  {
    path: '/queryByPage',
    handler: queryByPage,
  },
  {
    path: '/queryList',
    handler: queryList,
  },
  {
    path: '/insert',
    method: 'post',
    handler: insert,
  },
  {
    path: '/deleteById',
    method: 'delete',
    handler: deleteById,
  },
  {
    path: '/updateById',
    method: 'put',
    handler: updateById,
  },
  {
    path: '/queryById',
    handler: queryById,
  },
  {
    path: '/batchDelete',
    method: 'post',
    handler: batchDelete,
  },
  {
    path: '/batchMove',
    method: 'post',
    handler: batchMove,
  },
]

// 带拦截器的 router
const router = generateRouterWithInterceptor(routes)

export default router
