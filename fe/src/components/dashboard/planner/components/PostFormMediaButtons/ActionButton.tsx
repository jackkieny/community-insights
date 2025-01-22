import {
  Tooltip,
  Button
} from '@mantine/core'
import { IconBolt, IconBoltFilled } from '@tabler/icons-react'

interface ActionButtonProps {
  actionButtonSelected: boolean;
  setActionButtonSelected: (value: boolean) => void;
}

export function ActionButton({
  actionButtonSelected,
  setActionButtonSelected,
}: ActionButtonProps) {
  return (
    <>
      <Tooltip label='Action' position="bottom">
        <Button
          color='gray'
          onClick={() => setActionButtonSelected(!actionButtonSelected)}
        >
          {actionButtonSelected ? <IconBoltFilled color='red' /> : <IconBolt />}
        </Button>
      </Tooltip>
    </>
  )
}
