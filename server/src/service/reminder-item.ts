import { REMINDER_SUMMARY_CATEGORY } from '../enums/reminder'
import ReminderItem from '../models/reminder-item'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '../utils/error'
import {
  ReminderItemInstance,
  ReminderItemQueryParams,
} from 'business/reminder'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

// 分类查询的 where 参数对象映射
const CategoryWhereMap = {
  [REMINDER_SUMMARY_CATEGORY.T]: {
    finished: 'N',
    remindTime: {
      [Op.not]: null,
      [Op.lte]: new Date(`${dayjs().format('YYYY-MM-DD')} 23:59:59`),
    },
  },
  [REMINDER_SUMMARY_CATEGORY.P]: {
    finished: 'N',
    remindTime: {
      [Op.not]: null,
      [Op.gte]: new Date(`${dayjs().format('YYYY-MM-DD')} 00:00:00`),
    },
  },
  [REMINDER_SUMMARY_CATEGORY.A]: {
    finished: 'N',
  },
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

const batchDelete = async (params: { ids: string[] }) => {
  const ids = params.ids
  if (!ids) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 ids 不存在')
  await ReminderItem.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
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

/**
 * 批量移动提醒事项到指定列表
 * @param item 待移动的提醒事项 id 集合
 * @param parentId 移动到的指定列表 id
 */
const batchMove = async (params: { items: string[]; parentId: string }) => {
  const { items, parentId } = params
  if (!parentId)
    throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 parentId 不存在')
  await ReminderItem.update(
    { parentId },
    {
      where: {
        id: {
          [Op.in]: items,
        },
      },
    }
  )

  return true
}

export default {
  queryByPage,
  insert,
  deleteById,
  updateById,
  queryById,
  batchDelete,
  batchMove,
}
