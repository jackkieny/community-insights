import { DateTimePicker, DateValue } from '@mantine/dates';
import '@mantine/dates/styles.css';

interface PostFormDateTimePickerProps {
    datetime: DateValue;
    setDatetime: (value: DateValue) => void;
}

export function PostFormDateTimePicker({ datetime, setDatetime }: PostFormDateTimePickerProps) {
    return (
        <DateTimePicker
            label="Date and Time"
            placeholder="Select a Date and Time"
            clearable
            w="auto"
            value={datetime}
            onChange={(value) => setDatetime(value)}
        />
    )
}