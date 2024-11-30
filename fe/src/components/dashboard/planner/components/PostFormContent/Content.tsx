import { Textarea } from "@mantine/core";

interface PostFormContentProps {
  content: string;
  setContent: (value: string) => void;
}

export function Content({ content, setContent }: PostFormContentProps) {
  return (

    <Textarea
      label="Content"
      placeholder="Write something"
      autosize
      minRows={7}
      maxRows={10}
      value={content}
      onChange={(event) => setContent(event.currentTarget.value)}
    />
  )
}