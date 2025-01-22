import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconGif } from '@tabler/icons-react'

export function GIFs() {
  return (
    <>
      <Tooltip label='Not available' position="bottom">
        <Button color='gray' disabled>
          <IconGif />
        </Button>
      </Tooltip>
    </>
  )
}
