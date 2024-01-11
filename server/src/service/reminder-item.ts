import { REMINDER_SUMMARY_CATEGORY } from '@/enums/reminder'
import ReminderItem from '../models/reminder-item'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '../utils/error'
import {
  ReminderItemInstance,
  ReminderItemQueryParams,
} from 'business/reminder'

const CategoryWhereMap = {
  [REMINDER_SUMMARY_CATEGORY.T]: {},
  [REMINDER_SUMMARY_CATEGORY.P]: {},
  [REMINDER_SUMMARY_CATEGORY.A]: {},
}

const queryByPage = async (params: ReminderItemQueryParams) => {
  const { page = 1, pageSize = 10 } = params
  const where: any = {}
  for (const [key, value] of Object.entries(params)) {
    if (!['page', 'pageSize'].includes(key)) {
      if (key === 'category') Object.assign(where, CategoryWhereMap[value])
      else where[key] = value
    }
  }
  const { count, rows } = await ReminderItem.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    where,
  })

  return {
    total: count,
    totalPages: Math.ceil(count / pageSize),
    page,
    pageSize,
    data: rows,
  }
}

const insert = async (params: ReminderItemInstance) => {
  const reminder = await ReminderItem.create(params)
  return reminder
}

const deleteById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await ReminderItem.destroy({
    where: {
      id,
    },
  })

  return true
}

const updateById = async (params: ReminderItemInstance) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await ReminderItem.update(params, {
    where: {
      id,
    },
  })

  const reminder = await queryById({ id })

  return reminder
}

const queryById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  const reminder = await ReminderItem.findOne({
    where: {
      id,
    },
  })

  return reminder
}

export default {
  queryByPage,
  insert,
  deleteById,
  updateById,
  queryById,
}
