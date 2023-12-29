import AccountBookItem from '../models/account-book-item'
import { REQUEST_PARAMS_ERROR_CODE, ZiMuError } from '../utils/error'
import {
  AccountBookItemInstance,
  AccountBookItemQueryParams,
  RelationAccountBookItemAttributes,
} from 'business/account-book'
import RelationAccountBookItem from '../models/relation-account-book-item'
import { v4 as uuidV4 } from 'uuid'

const queryByPage = async (
  params: AccountBookItemQueryParams = { page: 1, pageSize: 10 }
) => {
  const { page, pageSize } = params
  const where: any = {}
  for (const [key, value] of Object.entries(params)) {
    if (!['page', 'pageSize'].includes(key)) {
      where[key] = value
    }
  }
  const { count, rows } = await AccountBookItem.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: 10,
    offset: (page - 1) * pageSize,
    where,
  })

  return {
    total: count,
    totalPages: Math.ceil(count / 10),
    page,
    pageSize,
    data: rows,
  }
}

const queryList = async (params: AccountBookItemQueryParams) => {
  const where = {}
  if (params) {
    Object.assign(where, params)
  }
  const { count, rows } = await AccountBookItem.findAndCountAll({
    order: [['createdAt', 'DESC']],
    where,
  })

  return {
    total: count,
    data: rows,
  }
}

const insert = async (params: AccountBookItemInstance) => {
  const accountBookItem = await AccountBookItem.create(params)

  const relatedIds = new Set((params.relatedIds ?? []).concat(params.parentId))

  const relations: RelationAccountBookItemAttributes[] = Array.from(
    relatedIds
  ).map((id: string) => ({
    id: uuidV4(),
    accountBookId: id,
    accountBookItemId: params.id,
    createdBy: 'admin',
    updatedBy: 'admin',
  }))

  await RelationAccountBookItem.bulkCreate(relations)

  return accountBookItem
}

const deleteById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await AccountBookItem.destroy({
    where: {
      id,
    },
  })

  await RelationAccountBookItem.destroy({
    where: {
      accountBookItemId: id,
    },
  })

  return true
}

const updateById = async (params: AccountBookItemInstance) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  await AccountBookItem.update(params, {
    where: {
      id,
    },
  })

  const accountBookItem = await queryById({ id })

  return accountBookItem
}

const queryById = async (params: { id: string }) => {
  const id = params.id
  if (!id) throw new ZiMuError(REQUEST_PARAMS_ERROR_CODE, '参数 id 不存在')
  const accountBookItem = await AccountBookItem.findOne({
    where: {
      id,
    },
  })

  return accountBookItem
}

export default {
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
}
