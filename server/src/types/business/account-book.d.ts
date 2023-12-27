import { Model } from 'sequelize'

interface AccountBookAttributes {
  id: string
  name: string
  type: string
  image: string
  incomes: number
  expenses: number
  created: string
  createdBy: string
  updated: string
  updatedBy: string
  deleteAt: string
}

/**
 * Model 类型两个参数
 * 1.
 */
export interface AccountBookInstance
  extends Model<AccountBookAttributes, AccountBookAttributes>,
    AccountBookAttributes {}
