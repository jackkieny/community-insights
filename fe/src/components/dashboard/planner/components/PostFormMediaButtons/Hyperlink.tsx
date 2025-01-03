import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconLink } from '@tabler/icons-react'

export function Hyperlink() {
  return (
    <>
      <Tooltip label='Check out the toolbar features for links' position="bottom">
        <Button color='gray' disabled>
          <IconLink />
        </Button>
      </Tooltip>
    </>
  )
}
