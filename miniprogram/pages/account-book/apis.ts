import { ACCOUNT_BOOK_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { AccountBook } from "./types"

/**
 * 请求接口集合
 */
export async function queryByPage(page: number, pageSize: number) {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_REQUEST_PATH_PREFIX}/queryByPage?page=${page}&pageSize=${pageSize}`
  })

  return data
}

export async function queryList() {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_REQUEST_PATH_PREFIX}/queryList`
  })

  return data
}

export async function insert(params: AccountBook) {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_REQUEST_PATH_PREFIX}/insert`,
    method: 'POST',
    data: params
  })

  return data
}

export async function deleteById(id: string) {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_REQUEST_PATH_PREFIX}/deleteById`,
    method: 'DELETE',
    data: {
      id
    }
  })

  return data
}