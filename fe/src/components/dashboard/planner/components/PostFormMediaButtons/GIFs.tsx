import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconGif } from '@tabler/icons-react'

export function GIFs() {
  return (
    <>
      <Tooltip label='GIFs' position="bottom">
        <Button color='gray'>
          <IconGif />
        </Button>
      </Tooltip>
    </>
  )
}
