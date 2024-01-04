import { DataTypes } from 'sequelize'
import sequelize from '../db'
import { ReminderInstance } from 'business/reminder'

/**
 * 提醒事项 model
 */
const Reminder = sequelize.define<ReminderInstance>(
  'Reminder',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    // 提醒事项名称
    name: DataTypes.STRING,
    // 该列表下的事项数量
    itemLength: DataTypes.VIRTUAL,
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
    tableName: 'reminder',
  }
)

export default Reminder
