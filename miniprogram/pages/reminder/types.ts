import { ReminderItem } from "../reminder-info/types";

export interface Reminder {
  id?: string
  name: string,
  items?: ReminderItem[]
}