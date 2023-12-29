import { ACCOUNT_BOOK_REQUEST_PATH_PREFIX, ACCOUNT_BOOK_ITEM_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { AccountBookInfo } from "./types"

// 根据账簿 id 查询详情
export async function queryAccountBookById(id: string): Promise<AccountBookInfo> {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_REQUEST_PATH_PREFIX}/queryById?id=${id}`
  })

  return data as unknown as AccountBookInfo
}

// 删除账簿明细
export async function deleteById(id: string): Promise<AccountBookInfo> {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_ITEM_REQUEST_PATH_PREFIX}/deleteById`,
    method: 'DELETE',
    data: {
      id
    }
  })

  return data as unknown as AccountBookInfo
}