import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconLink } from '@tabler/icons-react'

export function Hyperlink() {
  return (
    <>
      <Tooltip label='Link' position="bottom">
        <Button color='gray'>
          <IconLink />
        </Button>
      </Tooltip>
    </>
  )
}
