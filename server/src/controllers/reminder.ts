/**
 * 提醒事项 Controller
 */
import accountBookService from '../service/reminder'
import useBaseController, { BaseController } from './base'

const accountBookBaseController: BaseController =
  useBaseController(accountBookService)

const accountBookController = {
  ...accountBookBaseController,
}

export default accountBookController
