import { ReminderItem } from "../reminder-item/types";

export interface Reminder {
  id?: string
  name?: string,
  items?: ReminderItem[]
}