import { ACCOUNT_BOOK_ITEM_TYPES, ACCOUNT_BOOK_ITEM_INCOME_SOURCE, ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE, ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC, ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC, ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON } from '../../constants/account-book'
import dayjs from 'dayjs'

// type 和 source 默认选中映射
export const DefaultTypeSourceMap = {
  [ACCOUNT_BOOK_ITEM_TYPES.INCOME]: ACCOUNT_BOOK_ITEM_INCOME_SOURCE.INCOME_SALARY,
  [ACCOUNT_BOOK_ITEM_TYPES.EXPENSE]: ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE.EXPENSE_RENT
}

// 收入来源集合
export const IncomeSourceArray = Object.entries(ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC).map(([key, label]) => ({
  key,
  label,
  icon: ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON[key]
}))

// 支出用途集合
export const ExpenseSourceArray = Object.entries(ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC).map(([key, label]) => ({
  key,
  label,
  icon: ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON[key]
}))

// 账本明细初始信息
export const InitItemInfo = {
  amount: 0,
  type: ACCOUNT_BOOK_ITEM_TYPES.INCOME,
  source: ACCOUNT_BOOK_ITEM_INCOME_SOURCE.INCOME_SALARY,
  transactionTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}