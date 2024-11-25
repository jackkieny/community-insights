import { TextInput } from '@mantine/core'

interface PostFormTitleProps {
  title: string;
  setTitle: (value: string) => void;
}

export function PostFormTitle ({ title, setTitle }: PostFormTitleProps) {
  return (
    <TextInput
      label="Title"
      placeholder="Title"
      w="30%"
      value={title}
      onChange={(event) => setTitle(event.currentTarget.value)}
    />
  )
}