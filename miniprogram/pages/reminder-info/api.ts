import { REMINDER_ITEM_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { ReminderItem } from "./types"
import { stringify } from "../../utils/qs"

export async function queryByPage(page: number, pageSize: number, params = {}): Promise<ReminderItem[]> {
  params = Object.assign({
    page,
    pageSize
  }, params)
  const queryString = stringify(params)
  const { data } = await request({
    url: `${REMINDER_ITEM_REQUEST_PATH_PREFIX}/queryByPage?${queryString}`
  })

  return data
}

// 删除
export async function deleteById(id: string) {
  const { data } = await request({
    url: `${REMINDER_ITEM_REQUEST_PATH_PREFIX}/deleteById`,
    method: 'DELETE',
    data: {
      id
    }
  })

  return data
}