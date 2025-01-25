import { DateValue } from "@mantine/dates";

export const convertTimeToUTC = (datetime: DateValue) => {
  if (!datetime) return null;
  const utcDate = new Date(datetime);
  return utcDate.toISOString();
};

export const convertTimeToLocal = (isoString: string) => {
  if (!isoString) return null;
  return new Date(isoString);
};
