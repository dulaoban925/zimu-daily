/**
 * 账本 model
 */
import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { AccountBookInstance } from 'business/account-book'

const AccountBook = sequelize.define<AccountBookInstance>(
  'AccountBook',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    // 账本名称
    name: DataTypes.STRING,
    // 账本类型
    type: DataTypes.STRING,
    // 账本标识图
    image: DataTypes.STRING,
    // 总收入
    incomes: DataTypes.VIRTUAL,
    // 总支出
    expenses: DataTypes.VIRTUAL,
    // 创建时间
    created: DataTypes.DATE,
    // 创建人
    createdBy: DataTypes.STRING,
    // 更新时间
    updated: DataTypes.DATE,
    // 更新人
    updatedBy: DataTypes.STRING,
    // 删除时间，软删
    deleteAt: DataTypes.DATE,
  },
  {
    tableName: 'account_book',
  }
)

export default AccountBook
