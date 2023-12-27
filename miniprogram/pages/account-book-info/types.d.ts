import { AccountBook } from "../account-book/types";

export interface AccountBookInfo extends AccountBook {
  items: {
    month: string,
    detail: any
  }[]
}