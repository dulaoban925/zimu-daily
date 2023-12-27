import { ACCOUNT_BOOK_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { AccountBookInfo } from "./types"


export async function queryById(id: string): Promise<AccountBookInfo> {
  const { data } = await request({
    url: `${ACCOUNT_BOOK_REQUEST_PATH_PREFIX}/queryById`,
    data: {
      id
    }
  })

  return data as unknown as AccountBookInfo
}