import { REMINDER_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"
import { Reminder } from "./types"

// 获取分类统计数据
export async function querySummaryByCategory() {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/querySummaryByCategory`
  })

  return data
}

export async function queryByPage(page: number, pageSize: number) {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/queryByPage?page=${page}&pageSize=${pageSize}`
  })

  return data
}

// 根据提醒事项 id 查询详情
export async function queryById(id: string): Promise<Reminder> {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/queryById?id=${id}`
  })

  return data as Reminder
}

export async function insert(params: Reminder) {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/insert`,
    method: 'POST',
    data: params
  })

  return data
}

export async function deleteById(id: string) {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/deleteById`,
    method: 'DELETE',
    data: {
      id
    }
  })

  return data
}