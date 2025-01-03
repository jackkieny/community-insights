import { useState } from 'react'
import {
  Tooltip,
  Button,
  Kbd
} from '@mantine/core'
import { IconMoodSmileFilled } from '@tabler/icons-react'

export function Emoji() {
  
  const [tooltipOpened, setTooltipOpened] = useState(false)
  const handleButtonClick = () => setTooltipOpened((prev) => !prev);
  
  const emojiButtonLabel = <>
    Windows: <Kbd>Win</Kbd> + <Kbd>:</Kbd> <br/>
    Mac: <Kbd>Fn</Kbd> / <Kbd>🌐</Kbd> + <Kbd>E</Kbd> 
  </>  

  return (
    <>
      <Tooltip
        label={emojiButtonLabel}
        position="bottom"
        opened={tooltipOpened}
      >
        <Button
          color='gray'
          onClick={handleButtonClick}
        >
          <IconMoodSmileFilled />
        </Button>
      </Tooltip>
    </>
  )
}
