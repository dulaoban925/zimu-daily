import { Model } from 'sequelize'

/** 提醒事项头 start */
interface ReminderAttributes {
  id: string
  name: string
  itemLength: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  deletedAt: string
}

export interface ReminderInstance
  extends Model<ReminderAttributes, ReminderAttributes>,
    ReminderAttributes {}
/** 提醒事项头 end */
