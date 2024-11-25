import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconChartBar } from '@tabler/icons-react'

export function Polls() {
  return (
    <>
      <Tooltip label='Poll' position="bottom">
        <Button color='gray'>
          <IconChartBar />
        </Button>
      </Tooltip>
    </>
  )
}
