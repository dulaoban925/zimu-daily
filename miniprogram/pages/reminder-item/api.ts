import { REMINDER_ITEM_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { ReminderItem } from "../reminder-item/types"
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

// 新建
export async function insert(params: ReminderItem) {
  const { data } = await request({
    url: `${REMINDER_ITEM_REQUEST_PATH_PREFIX}/insert`,
    method: 'POST',
    data: params
  })

  return data
}

// 更新
export async function updateById(params: ReminderItem) {
  const { data } = await request({
    url: `${REMINDER_ITEM_REQUEST_PATH_PREFIX}/updateById`,
    method: 'PUT',
    data: params
  })

  return data
}

// 查询详情
export async function queryById(id: string) {
  const { data} = await  request({
    url: `${REMINDER_ITEM_REQUEST_PATH_PREFIX}/queryById?id=${id}`,
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

// 批量删除
export async function batchDelete(ids: string) {
  const { data } = await request({
    url: `${REMINDER_ITEM_REQUEST_PATH_PREFIX}/batchDelete`,
    method: 'POST',
    data: {
      ids
    }
  })

  return data
}