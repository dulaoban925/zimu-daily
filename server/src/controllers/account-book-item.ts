/**
 * 账本 Controller
 */
import accountBookItemService from '../service/account-book-item'
import useBaseController, { BaseController } from './base'

const accountBookItemBaseController: BaseController = useBaseController(
  accountBookItemService
)

const accountBookItemController = {
  ...accountBookItemBaseController,
}

export default accountBookItemController
