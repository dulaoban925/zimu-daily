export interface AccountBook {
  id?: string
  name: string
  type: string // 账本类别
  incomes?: number
  expenses?: number
  image: string
  created?: string
  cratedBy?: string
}