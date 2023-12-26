import { Request, Response } from 'express'
import AccountBook from '../models/account-book'
import { ZiMu } from 'zimu'

const queryByPage = async (req: Request) => {
  const { page = 1, pageSize = 10 } = req.query as unknown as ZiMu.PageQuery
  const accountBooks = await AccountBook.findAll({
    order: [['created', 'DESC']],
    limit: 10,
    offset: (page - 1) * pageSize,
  })

  const count = await AccountBook.count()

  return {
    total: count,
    totalPages: Math.ceil(count / 10),
    page,
    pageSize,
    data: accountBooks,
  }
}

const queryList = async (req: Request, res: Response) => {
  const accountBooks = await AccountBook.findAll({
    order: [['created', 'DESC']],
  })
  res.send(accountBooks)
}

const insert = async (req: Request, res: Response) => {
  const accountBook = await AccountBook.create(req.body)
  res.send(accountBook)
}

const deleteById = async (req: Request, res: Response) => {
  const id = req.body.id
  if (!id) {
    res.send(false)
    return
  }
  await AccountBook.destroy({
    where: {
      id,
    },
  })
  res.send(true)
}

const updateById = async (req: Request, res: Response) => {
  const id = req.body.id
  if (!id) {
    res.send(false)
    return
  }
  const accountBook = await AccountBook.update(req.body, {
    where: {
      id,
    },
  })
  res.send(`成功更新 ${accountBook[0]} 条`)
}

const queryById = async (req: Request, res: Response) => {
  const id = req.query.id
  if (!id) {
    res.send(false)
    return
  }
  const accountBook = await AccountBook.findOne({
    where: {
      id,
    },
  })
  res.send(accountBook)
}

export default {
  queryByPage,
  queryList,
  insert,
  deleteById,
  updateById,
  queryById,
}
