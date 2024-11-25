import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconMoodSmileFilled } from '@tabler/icons-react'

export function Emoji() {
  return (
    <>
      <Tooltip label='Emoji' position="bottom">
        <Button color='gray'>
          <IconMoodSmileFilled />
        </Button>
      </Tooltip>
    </>
  )
}
