import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconChartBar } from '@tabler/icons-react'

interface PollsProps {
  pollButtonSelected: boolean;
  setPollButtonSelected: (value: boolean) => void;
}


export function Polls({pollButtonSelected, setPollButtonSelected}: PollsProps ){
  return (
    <>
      <Tooltip label='Poll' position="bottom">
        <Button color='gray' onClick={() => setPollButtonSelected(!pollButtonSelected)}>
          <IconChartBar color={pollButtonSelected ? "var(--orange-6)" : undefined} />
        </Button>
      </Tooltip>
    </>
  )
}
