import { ZiMu } from 'zimu'
import reminderController from '../controllers/reminder'
import { generateRouterWithInterceptor } from '../utils/router'

const {
  querySummaryByCategory,
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
} = reminderController

// 所有路由
export const routes: ZiMu.RouteDefine[] = [
  {
    path: '/querySummaryByCategory',
    handler: querySummaryByCategory,
  },
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
]

// 带拦截器的 router
const router = generateRouterWithInterceptor(routes)

export default router
