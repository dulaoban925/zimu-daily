/**
 * 账本 model
 */
import { DataTypes } from 'sequelize'
import sequelize from '../db'

const AccountBook = sequelize.define(
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
    // 创建时间
    created: DataTypes.DATE,
    // 创建人
    createdBy: {
      type: DataTypes.STRING,
      field: 'created_by',
    },
    // 更新时间
    updated: DataTypes.DATE,
    // 更新人
    updatedBy: {
      type: DataTypes.STRING,
      // 设置表字段，若不设置，则与表字段相同
      field: 'updated_by',
    },
    // 删除标识
    isDelete: DataTypes.STRING,
  },
  {
    tableName: 'account_book',
  }
)

export default AccountBook
