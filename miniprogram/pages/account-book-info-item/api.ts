import { ACCOUNT_BOOK_ITEM_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { AccountBookItem } from "./types"

// 新建
export async function insert(params: AccountBookItem) {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_ITEM_REQUEST_PATH_PREFIX}/insert`,
    method: 'POST',
    data: params
  })

  return data
}

// 查询详情
export async function queryById(id: string) {
  const { data} = await  request({
    url: `${ACCOUNT_BOOK_ITEM_REQUEST_PATH_PREFIX}/queryById?id=${id}`,
  })

  return data
}