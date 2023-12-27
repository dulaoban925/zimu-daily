import { Model } from 'sequelize'

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

/**
 * Model 类型两个参数
 * 1.
 */
export interface AccountBookInstance
  extends Model<AccountBookAttributes, AccountBookAttributes>,
    AccountBookAttributes {}
