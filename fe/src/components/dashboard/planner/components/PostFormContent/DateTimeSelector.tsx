import { DateTimePicker, DateValue } from '@mantine/dates';
import '@mantine/dates/styles.css';

interface PostFormDateTimePickerProps {
  datetime: DateValue;
  setDatetime: (value: DateValue) => void;
  datetimeError: string | null;
  setDatetimeError: (error: string | null) => void;
}


export function DateTimeSelector({ datetime, setDatetime, datetimeError, setDatetimeError }: PostFormDateTimePickerProps) {

  const checkDatetime = (datetime: DateValue | null) => {
    if (!datetime) {
      setDatetimeError('Date and Time is required');
      return;
    }
    else if(datetime < new Date(new Date().getTime() + 1000 * 60 * 15)) {
      setDatetimeError('Datetime should be at least 15 minutes from now');
      return;
    }
    else {
      setDatetimeError(null);
    }

  }

  return (
    <DateTimePicker
      label="Date and Time"
      required
      placeholder="Select a Date and Time"
      clearable
      minDate={new Date()}
      w="auto"
      value={datetime}
      onChange={(value) => {
        setDatetime(value);
        checkDatetime(value);

      }}
      error={datetimeError}
    />
  )
}