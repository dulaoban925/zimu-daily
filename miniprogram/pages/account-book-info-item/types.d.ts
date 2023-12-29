export interface AccountBookItem {
  id: string
  type: string
  source: string
  amount: number
  comment: string
  transactionTime: string
  parentId: string
  relatedIds?: string[]
}