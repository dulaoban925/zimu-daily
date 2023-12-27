import request from "../../utils/request"
import { AccountBook } from "./types"

/**
 * 请求接口集合
 */
// 接口前缀
const apiPrefix = '/account-book'

export async function queryByPage(page: number, pageSize: number) {
  const { data } = await request({
    url: `${apiPrefix}/queryByPage?page=${page}&pageSize=${pageSize}`
  })

  return data
}

export async function insert(params: AccountBook) {
  const { data } = await request({
    url: `${apiPrefix}/insert`,
    method: 'POST',
    data: params
  })

  return data
}

export async function deleteById(id: string) {
  const { data } = await request({
    url: `${apiPrefix}/deleteById`,
    method: 'DELETE',
    data: {
      id
    }
  })

  return data
}