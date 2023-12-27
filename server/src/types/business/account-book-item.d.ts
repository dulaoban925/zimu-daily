import { Model } from 'sequelize'
import { ZiMu } from 'zimu'

interface AccountBookItemAttributes {
  id: string
  parentId: string
  type: string
  source: string
  amount: number
  comment: number
  transactionTime: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  deletedAt: string
}

export interface AccountBookItemInstance
  extends Model<AccountBookItemAttributes, AccountBookItemAttributes>,
    AccountBookItemAttributes {}

export interface QueryParams extends ZiMu.PageQuery {
  parentId?: string
  type?: string
  source?: string
  transactionTime?: string
}
