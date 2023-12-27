import AccountBook from '../models/account-book'
import { ZiMu } from 'zimu'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '@/utils/error'
import { AccountBookInstance } from 'business/account-book'

const queryByPage = async (params: ZiMu.PageQuery) => {
  const { page = 1, pageSize = 10 } = params
  const { count, rows } = await AccountBook.findAndCountAll({
    order: [['created', 'DESC']],
    limit: 10,
    offset: (page - 1) * pageSize,
  })

  rows.length &&
    rows.map(async (row) => {
      row.incomes = 0
      row.expenses = 0
      return row
    })

  return {
    total: count,
    totalPages: Math.ceil(count / 10),
    page,
    pageSize,
    data: rows,
  }
}

const queryList = async () => {
  const { count, rows } = await AccountBook.findAndCountAll({
    order: [['created', 'DESC']],
  })

  return {
    total: count,
    data: rows,
  }
}

const insert = async (params: AccountBookInstance) => {
  const accountBook = await AccountBook.create(params)

  return accountBook
}

const deleteById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await AccountBook.destroy({
    where: {
      id,
    },
  })

  return true
}

const updateById = async (params: AccountBookInstance) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await AccountBook.update(params, {
    where: {
      id,
    },
  })

  const accountBook = await queryById({ id })

  return accountBook
}

const queryById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  const accountBook = await AccountBook.findOne({
    where: {
      id,
    },
  })

  return accountBook
}

export default {
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
}
