import { REMINDER_REQUEST_PATH_PREFIX } from "../../constants/request"
import request from "../../utils/request"

interface Reminder {
  name: string
}

export async function queryByPage(page: number, pageSize: number) {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/queryByPage?page=${page}&pageSize=${pageSize}`
  })

  return data
}

export async function insert(params: Reminder) {
  const { data } = await request({
    url: `${REMINDER_REQUEST_PATH_PREFIX}/insert`,
    method: 'POST',
    data: params
  })

  return data
}