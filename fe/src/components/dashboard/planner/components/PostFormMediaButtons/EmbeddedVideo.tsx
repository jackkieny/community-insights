import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconBrandYoutube } from '@tabler/icons-react'

export function EmbeddedVideo() {
  return (
    <>
      <Tooltip label='YouTube/Vimeo/Loom' position="bottom">
        <Button color='gray'>
          <IconBrandYoutube />
        </Button>
      </Tooltip>
    </>
  )
}
