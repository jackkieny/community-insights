import {
  Tooltip,
  Button,
} from '@mantine/core'
import { IconPaperclip } from '@tabler/icons-react'

export function FileAttachment() {
  return (
    <>
      <Tooltip label='Not available' position="bottom">
        <Button disabled color='gray'>
            <IconPaperclip />
        </Button>
      </Tooltip>
    </>
  )
}
