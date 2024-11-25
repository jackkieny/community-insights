import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconPaperclip } from '@tabler/icons-react'

export function FileAttachment() {
  return (
    <>
      <Tooltip label='File' position="bottom">
        <Button color='gray'>
            <IconPaperclip />
        </Button>
      </Tooltip>
    </>
  )
}
