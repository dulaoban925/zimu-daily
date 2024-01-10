/**
 * 提醒事项常量
 */
// 提醒事项分类
export const REMINDER_CATEGORY = {
  TODAY: 'today',
  PLAN: 'plan',
  ALL: 'all'
}

export const REMINDER_CATEGORY_DESC = {
  [REMINDER_CATEGORY.TODAY]: '今天',
  [REMINDER_CATEGORY.PLAN]: '计划',
  [REMINDER_CATEGORY.ALL]: '全部',
}

// 提醒事项优先级
export const REMINDER_PRIORITY = {
  NONE: '',
  L: 'l',
  M: 'm',
  H: 'h'
}

export const REMINDER_PRIORITY_DESC = {
  [REMINDER_PRIORITY.NONE]: '无',
  [REMINDER_PRIORITY.L]: '低',
  [REMINDER_PRIORITY.M]: '中',
  [REMINDER_PRIORITY.H]: '高'
}

export const REMINDER_PRIORITY_MARK = {
  [REMINDER_PRIORITY.NONE]: '',
  [REMINDER_PRIORITY.L]: '!',
  [REMINDER_PRIORITY.M]: '!!',
  [REMINDER_PRIORITY.H]: '!!!'
}

export const REMINDER_PRIORITY_MARK_COLOR = {
  [REMINDER_PRIORITY.NONE]: '',
  [REMINDER_PRIORITY.L]: 'var(--color-primary)',
  [REMINDER_PRIORITY.M]: 'var(--color-warn)',
  [REMINDER_PRIORITY.H]: 'var(--color-danger)'
}