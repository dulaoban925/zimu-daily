/**
 * 提醒事项 Controller
 */
import reminderItemService from '../service/reminder-item'
import useBaseController, { BaseController } from './base'

const reminderItemBaseController: BaseController =
  useBaseController(reminderItemService)

const reminderItemController = {
  ...reminderItemBaseController,
  batchDelete: reminderItemService.batchDelete,
}

export default reminderItemController
