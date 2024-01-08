/**
 * 提醒事项 Controller
 */
import reminderService from '../service/reminder'
import useBaseController, { BaseController } from './base'

const reminderBaseController: BaseController =
  useBaseController(reminderService)

const reminderController = {
  ...reminderBaseController,
}

export default reminderController
