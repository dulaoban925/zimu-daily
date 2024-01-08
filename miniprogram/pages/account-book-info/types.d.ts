import { AccountBookItem } from "../account-book-item/types";
import { AccountBook } from "../account-book/types";

export interface AccountBookInfo extends AccountBook {
  items: {
    month: string,
    detail: AccountBookItem
  }[]
}