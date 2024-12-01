import {
  Tooltip,
  Button,
  Modal,
  Input,
  Title,
} from '@mantine/core'
import { IconBrandYoutube } from '@tabler/icons-react'
import { validateVideoLink, getVideoIFrame } from '../../handlers/handleValidateVideoLink'
import { useState } from 'react';

interface EmbeddedVideoButtonProps {
  embeddedVideoSelected: boolean;
  setEmbeddedVideoSelected: (selected: boolean) => void;
  videos: string[];
  setVideos: (videos: string[]) => void;
  videoIFrames: string[];
  setVideoIFrames: (videoIFrames: string[]) => void;
}

export function EmbeddedVideoButton(
  {
    embeddedVideoSelected,
    setEmbeddedVideoSelected,
    videos,
    setVideos,
    videoIFrames,
    setVideoIFrames
  }: EmbeddedVideoButtonProps) {
  const [videoLink, setVideoLink] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleInsert = async () => {
    if (videoLink === '') {
      setErrorMsg('Please enter a video link')
      return
    }

    const { isValid, videoType } = validateVideoLink(videoLink)
    if (!isValid) {
      setErrorMsg('Invalid video link')
      return
    }
    const { html, error } = await getVideoIFrame(videoType, videoLink)
    if (error) {
      setErrorMsg('Invalid video link')
      return
    } else if (!html) {
      setErrorMsg('Invalid video link')
      return
    } else {
      setVideos([...videos, videoLink])
      setVideoIFrames([...videoIFrames, html])
    }
    handleClose()


  }

  const handleClose = () => {
    setVideoLink('')
    setErrorMsg('')
    setEmbeddedVideoSelected(false)
  }

  return (
    <>
      <Tooltip label='YouTube/Vimeo/Loom' position="bottom">
        <Button color='gray' onClick={() => setEmbeddedVideoSelected(!embeddedVideoSelected)}>
          <IconBrandYoutube color={embeddedVideoSelected ? "#FF4040" : undefined} />
        </Button>
      </Tooltip>
      <Modal
        opened={embeddedVideoSelected}
        onClose={() => handleClose()}
        title="Insert Embedded Video"
      >
        <Title order={4}>Enter a Youtube, Vimeo, Loom or Wistia link</Title>
        <Input
          required
          placeholder="Enter video URL"
          mt={10}
          value={videoLink}
          onChange={(e) => { setVideoLink(e.target.value); setErrorMsg('') }}
          {...errorMsg && { error: errorMsg }}
        />
        <Button
          mt={15}
          fullWidth
          onClick={() => handleInsert()}
        >Insert</Button>
      </Modal>
    </>
  )
}
