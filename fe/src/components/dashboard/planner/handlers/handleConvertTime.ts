import { DateValue } from "@mantine/dates";

export const convertTimeToUTC = (datetime: DateValue) => {
  if (!datetime) return null;
  const date = new Date(datetime);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
};

export const convertTimeToLocal = (datetime: DateValue) => {
  if (!datetime) return null;
  const date = new Date(datetime);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};