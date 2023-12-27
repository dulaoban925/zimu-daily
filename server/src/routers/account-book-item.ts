import { ZiMu } from 'zimu'
import accountBookItemController from '../controllers/account-book-item'
import { generateRouterWithInterceptor } from '../utils/router'

const { queryByPage, queryList, insert, deleteById, updateById, queryById } =
  accountBookItemController

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
]

// 带拦截器的 router
const router = generateRouterWithInterceptor(routes)

export default router
