/**
 * 账簿和明细关系表 model
 */
import { DataTypes } from 'sequelize'
import sequelize from '../db'
import AccountBook from './account-book'
import AccountBookItem from './account-book-item'
import { RelationAccountBookItemInstance } from 'business/account-book'

const RelationAccountBookItem =
  sequelize.define<RelationAccountBookItemInstance>(
    'RelationAccountBookItem',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      // 账本id
      accountBookId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: AccountBook,
          key: 'id',
        },
      },
      // 明细 id
      accountBookItemId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: AccountBookItem,
          key: 'id',
        },
      },
      // 创建时间
      createdAt: DataTypes.DATE,
      // 创建人
      createdBy: DataTypes.STRING,
      // 更新时间
      updatedAt: DataTypes.DATE,
      // 更新人
      updatedBy: DataTypes.STRING,
      // 删除时间，软删
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: 'relation_account_book_item',
    }
  )

export default RelationAccountBookItem
