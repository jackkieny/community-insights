import { Modal, Button, Group } from '@mantine/core'
import { useState } from 'react'

interface CreatePostFormProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostForm({ open, onClose }: CreatePostFormProps) {
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false)

  const handleCloseForm = () => {
    setConfirmCloseOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmCloseOpen(false)
    onClose()
  }

  const handleCancelClose = () => {
    setConfirmCloseOpen(false)
  }

  return (
    <>
      <Modal
        opened={open}
        onClose={handleCloseForm}
        title="Create Post"
        size="50%"
        centered
      >
        <h1>This is the form</h1>
      </Modal>


      {/* Confirm Close */}
      <Modal
        opened={confirmCloseOpen}
        onClose={handleCancelClose}
        title="Confirm"
        style={{textAlign: 'center'}}
      >
        <p><strong>Are you sure you want to close the form?</strong></p>
        <Group justify="space-around">
          <Button onClick={handleCancelClose}>Cancel</Button>
          <Button onClick={handleConfirmClose} color="red">Yes</Button>
        </Group>
      </Modal>
    </>
  )
}