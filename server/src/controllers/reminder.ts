/**
 * 提醒事项 Controller
 */
import * as reminderService from '../service/reminder'
import useBaseController, { BaseController } from './base'

const reminderBaseController: BaseController =
  useBaseController(reminderService)

const reminderController = {
  ...reminderBaseController,
  querySummaryByCategory: reminderService.querySummaryByCategory,
}

export default reminderController
