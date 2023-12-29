import AccountBook from '../models/account-book'
import { ZiMu } from 'zimu'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '../utils/error'
import { AccountBookInstance } from 'business/account-book'
import AccountBookItem from '../models/account-book-item'
import RelationAccountBookItem from '../models/relation-account-book-item'

// 表关联，AccountBookItem
const ItemJoinAlias = 'items'
AccountBook.belongsToMany(AccountBookItem, {
  through: RelationAccountBookItem,
  as: ItemJoinAlias,
})

const queryByPage = async (params: ZiMu.PageQuery) => {
  const { page = 1, pageSize = 10 } = params
  const { count, rows } = await AccountBook.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: 10,
    offset: (page - 1) * pageSize,
  })

  rows?.forEach(async (row) => {
    const { incomes, expenses } = await queryIeTotalById(row.id)
    row.incomes = incomes
    row.expenses = expenses
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
    order: [['createdAt', 'DESC']],
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
    include: { model: AccountBookItem, as: ItemJoinAlias },
  })

  if (accountBook) {
    const { incomes, expenses } = await queryIeTotalById(id)
    accountBook.incomes = incomes
    accountBook.expenses = expenses
  }

  return accountBook
}

// 查询账本收入/支出总额
const queryIeTotalById = async (id: string) => {
  const incomes = await AccountBookItem.sum('amount', {
    where: {
      parentId: id,
      type: 'income',
    },
  })

  const expenses = await AccountBookItem.sum('amount', {
    where: {
      parentId: id,
      type: 'expense',
    },
  })

  console.log('amount', incomes, expenses)
  return {
    incomes: incomes ?? 0,
    expenses: expenses ?? 0,
  }
}

export default {
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
}
