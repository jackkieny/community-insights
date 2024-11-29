import { TextInput } from '@mantine/core'

interface PostFormTitleProps {
  title: string;
  setTitle: (value: string) => void;
}

export function Title ({ title, setTitle }: PostFormTitleProps) {
  return (
    <TextInput
      label="Title"
      required
      placeholder="Title"
      w="30%"
      value={title}
      onChange={(event) => setTitle(event.currentTarget.value)}
    />
  )
}