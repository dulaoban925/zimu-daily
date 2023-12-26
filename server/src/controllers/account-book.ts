/**
 * 账本 Controller
 */
import accountBookService from '../service/account-book'
import useBaseController, { BaseController } from './base'

const accountBookBaseController: BaseController =
  useBaseController(accountBookService)

const accountBookController = {
  ...accountBookBaseController,
}

export default accountBookController
