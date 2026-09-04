import { BANGKOK_TIME_ZONE } from "../constants/date-time";

const bangkokDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: BANGKOK_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function formatBangkokDateTime(date: Date = new Date()): string {
  return bangkokDateTimeFormatter.format(date).replace(", ", " ");
}
