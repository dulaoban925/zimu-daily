import { Model } from 'sequelize'
import { ZiMu } from 'zimu'

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
/** 提醒事项明细 start */
interface ReminderItemAttributes {
  id: string
  parentId: string
  title: string
  remindFlag: string
  remindTime: string
  priority: string
  comment: string
  finished: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  deletedAt: string
}

export interface ReminderItemInstance
  extends Model<ReminderItemAttributes, ReminderItemAttributes>,
    ReminderItemAttributes {}

export interface ReminderItemQueryParams extends ZiMu.PageQuery {
  parentId?: string
  category?: string
  finished?: string
}
/** 提醒事项明细 end */
