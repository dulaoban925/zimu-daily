import { AccountBookItem } from "../account-book-info-item/types";
import { AccountBook } from "../account-book/types";

export interface AccountBookInfo extends AccountBook {
  items: {
    month: string,
    detail: AccountBookItem
  }[]
}