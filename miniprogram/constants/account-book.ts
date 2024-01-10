/**
 * 账本常量
 */
/**
 * 账本类型:（用来控制账本模板，待设计）
 * 1.自定义
 * 2.待定
 */
const serverPrefix = getApp().globalData.serverPrefix

export const ACCOUNT_BOOK_TYPES = {
  CUSTOM: 'custom',
}

export const ACCOUNT_BOOK_TYPES_ARRAY = [
  {
    key: ACCOUNT_BOOK_TYPES.CUSTOM,
    label: '自定义',
    image: `${serverPrefix}/account-book-type-custom.jpg`
  }
]

/**
 * 账本明细类型
 */
export const ACCOUNT_BOOK_ITEM_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
}

export const ACCOUNT_BOOK_ITEM_TYPE_DESC = {
  [ACCOUNT_BOOK_ITEM_TYPES.INCOME]: '收入',
  [ACCOUNT_BOOK_ITEM_TYPES.EXPENSE]: '支出'
}

/**
 * 账本明细用途
 * 收入：
 * 1.工资
 *
 * 支出：
 * 1.房租
 */
export const ACCOUNT_BOOK_ITEM_INCOME_SOURCE = {
  INCOME_SALARY: 'income_salary',
}

export const ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC = {
  [ACCOUNT_BOOK_ITEM_INCOME_SOURCE.INCOME_SALARY]: '工资',
}

export const ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE = {
  EXPENSE_RENT: 'expense_rent'
}

export const ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC = {
  [ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE.EXPENSE_RENT]: '房租'
}

// 汇总
export const ACCOUNT_BOOK_ITEM_IE_SOURCE = Object.assign({}, ACCOUNT_BOOK_ITEM_INCOME_SOURCE, ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE)

export const ACCOUNT_BOOK_ITEM_IE_SOURCE_DESC = Object.assign({}, ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC, ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC)

export const ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON = {
  [ACCOUNT_BOOK_ITEM_IE_SOURCE.INCOME_SALARY]: 'balance-o',
  [ACCOUNT_BOOK_ITEM_IE_SOURCE.EXPENSE_RENT]: 'home-o'
}