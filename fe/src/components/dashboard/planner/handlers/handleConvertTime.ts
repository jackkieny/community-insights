import { DateValue } from "@mantine/dates";

export const convertTimeToUTC = (datetime: DateValue) => {
  if (!datetime) return null;
  const utcDate = new Date(datetime);
  return utcDate.toISOString();
};

export const convertTimeToLocal = (isoString: string) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};
