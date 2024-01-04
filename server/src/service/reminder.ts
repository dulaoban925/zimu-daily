import Reminder from '../models/reminder'
import { ZiMu } from 'zimu'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '../utils/error'
import { ReminderInstance } from 'business/reminder'

const queryByPage = async (params: ZiMu.PageQuery) => {
  const { page = 1, pageSize = 10 } = params
  const { count, rows } = await Reminder.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  return {
    total: count,
    totalPages: Math.ceil(count / pageSize),
    page,
    pageSize,
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

export default {
  queryByPage,
  insert,
  deleteById,
  updateById,
  queryById,
}
