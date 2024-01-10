import { ReminderItemInstance } from 'business/reminder'
import sequelize from '../db'
import { DataTypes } from 'sequelize'
import dayjs from 'dayjs'

/**
 * 提醒事项明细 model
 */
const ReminderItem = sequelize.define<ReminderItemInstance>(
  'ReminderItem',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    parentId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    // 提醒事项标题
    title: DataTypes.STRING,
    // 是否消息提醒
    remindFlag: DataTypes.STRING,
    // 提醒时间
    remindTime: {
      type: DataTypes.DATE,
      get() {
        const val = this.getDataValue('remindTime')
        return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : null
      },
    },
    // 备注
    comment: DataTypes.STRING,
    // 是否已完成
    finished: DataTypes.STRING,
    // 优先级
    priority: DataTypes.STRING,
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
    tableName: 'reminder-item',
  }
)

export default ReminderItem
