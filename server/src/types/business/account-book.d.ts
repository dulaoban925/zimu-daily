import { Model } from 'sequelize'
import { ZiMu } from 'zimu'

/** 账簿头 start */
interface AccountBookAttributes {
  id: string
  name: string
  type: string
  image: string
  incomes: number
  expenses: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  deletedAt: string
}

export interface AccountBookInstance
  extends Model<AccountBookAttributes, AccountBookAttributes>,
    AccountBookAttributes {}
/** 账簿头 end */

/** 明细 start */

export interface AccountBookItemAttributes {
  id: string
  parentId: string
  type: string
  source: string
  amount: number
  comment: number
  transactionTime: string
  relatedIds?: string[]
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  deletedAt: string
}

export interface AccountBookItemInstance
  extends Model<AccountBookItemAttributes, AccountBookItemAttributes>,
    AccountBookItemAttributes {}

export interface AccountBookItemQueryParams extends ZiMu.PageQuery {
  parentId?: string
  type?: string
  source?: string
  transactionTime?: string
}

/** 明细 end */

/** 账簿和明细关系表 start */
export interface RelationAccountBookItemAttributes {
  id: string
  accountBookId: string
  accountBookItemId: string
  createdAt?: string
  createdBy: string
  updatedAt?: string
  updatedBy: string
  deletedAt?: string
}

export interface RelationAccountBookItemInstance
  extends Model<
      RelationAccountBookItemAttributes,
      RelationAccountBookItemAttributes
    >,
    RelationAccountBookItemAttributes {}
/** 账簿和明细关系表 end */
