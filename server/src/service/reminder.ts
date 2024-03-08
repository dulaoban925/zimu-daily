import Reminder from '../models/reminder'
import { ZiMu } from 'zimu'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '../utils/error'
import { ReminderInstance } from 'business/reminder'
import ReminderItem from '../models/reminder-item'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

// 获取统计指标
const querySummaryByCategory = async () => {
  // 今天 - 提醒日期今天及以前的事项
  const today = await ReminderItem.count({
    where: {
      finished: 'N',
      remindTime: {
        [Op.not]: null,
        [Op.lte]: new Date(`${dayjs().format('YYYY-MM-DD')} 23:59:59`),
      },
    },
  })
  // 计划 - 提醒日期今天及以后的事项
  const plan = await ReminderItem.count({
    where: {
      finished: 'N',
      remindTime: {
        [Op.not]: null,
        [Op.gte]: new Date(`${dayjs().format('YYYY-MM-DD')} 00:00:00`),
      },
    },
  })
  // 全部 - 所有未完成的提醒事项
  const all = await ReminderItem.count({
    where: {
      finished: 'N',
    },
  })

  return {
    today: today,
    plan: plan,
    all: all,
  }
}

const queryByPage = async (params: ZiMu.PageQuery) => {
  const { page = 1, pageSize = 10 } = params
  const { count, rows } = await Reminder.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const itemLength = await ReminderItem.count({
        where: {
          parentId: rows[i].id,
          finished: 'N',
        },
      })
      rows[i].itemLength = itemLength
    }
  }

  return {
    total: count,
    totalPages: Math.ceil(count / pageSize),
    page,
    pageSize,
    data: rows,
  }
}

const queryList = async () => {
  const { count, rows } = await Reminder.findAndCountAll({
    order: [['createdAt', 'DESC']],
  })

  return {
    total: count,
    data: rows,
  }
}

const insert = async (params: ReminderInstance) => {
  const reminder = await Reminder.create(params)
  return reminder
}

const deleteById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await Reminder.destroy({
    where: {
      id,
    },
  })

  // 删除列表下所有代办事项
  await ReminderItem.destroy({
    where: {
      parentId: id,
    },
  })

  return true
}

const updateById = async (params: ReminderInstance) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await Reminder.update(params, {
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
  const reminder = await Reminder.findOne({
    where: {
      id,
    },
  })

  return reminder
}

const batchDelete = async (params: { ids: string[] }) => {
  const ids = params.ids
  if (!ids) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 ids 不存在')
  await Reminder.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  })

  // 删除列表下所有代办事项
  await ReminderItem.destroy({
    where: {
      parentId: {
        [Op.in]: ids,
      },
    },
  })

  return true
}

export {
  querySummaryByCategory,
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
  batchDelete,
}
