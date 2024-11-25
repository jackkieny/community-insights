import { 
    Modal,
    Button,
    Group,
    ComboboxItem,
} from '@mantine/core'
import { useState } from 'react'

import { PostFormTitle } from './components/PostFormTitle';
import { PostFormContent } from './components/PostFormContent';
import { PostFormDateTimePicker } from './components/PostFormDateTimePicker';
import { DateValue } from '@mantine/dates';
import { PostFormLabelSelector } from './components/PostFormLabelSelector';
import { ActionButton } from './components/PostFormMediaButtons/ActionButton';
import { FileAttachment } from './components/PostFormMediaButtons/FileAttachment';
import { Hyperlink } from './components/PostFormMediaButtons/Hyperlink';
import { EmbeddedVideo } from './components/PostFormMediaButtons/EmbeddedVideo';
import { Polls } from './components/PostFormMediaButtons/Polls';
import { Emoji } from './components/PostFormMediaButtons/Emoji';
import { GIFs } from './components/PostFormMediaButtons/GIFs';

interface CreatePostFormProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostForm({ open, onClose }: CreatePostFormProps) {

  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false)
  const handleCloseForm = () => { setConfirmCloseOpen(true) }
  const handleConfirmClose = () => { setConfirmCloseOpen(false); onClose(); }
  const handleCancelClose = () => { setConfirmCloseOpen(false) }

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [datetime, setDatetime] = useState<DateValue | null>(null)
  const [label, setLabel] = useState<ComboboxItem | null>(null)
  const [actionButtonSelected, setActionButtonSelected] = useState(false)


  return (
    <>
      <Modal
        opened={open}
        onClose={handleCloseForm}
        title="Create Post"
        size="75%"
        centered
      >
        <PostFormTitle title={title} setTitle={setTitle} />
        <PostFormContent content={content} setContent={setContent} />
        <Group justify='space-between'>
          <Group>
            <FileAttachment />
            <Hyperlink />
            <EmbeddedVideo />
            <Polls />
            <ActionButton actionButtonSelected={actionButtonSelected} setActionButtonSelected={setActionButtonSelected} />
            <Emoji />
            <GIFs />
          </Group>
          <Group justify='space-around'>
            <PostFormLabelSelector label={label} setLabel={setLabel} />
            <PostFormDateTimePicker datetime={datetime} setDatetime={setDatetime} />
          </Group>
        </Group>
        <Group justify='center'>
          <Button color='green' mt={25} fullWidth>Create Post!</Button>
        </Group>
        
      </Modal>


      {/* Confirm Close */}
      <Modal
        opened={confirmCloseOpen}
        onClose={handleCancelClose}
        title="Confirm"
        style={{textAlign: 'center'}}
      >
        <p><strong>Are you sure you want to close the form?</strong></p>
        <p>This will clear the post form and it will not be saved.</p>
        <Group justify="space-around">
          <Button onClick={handleCancelClose}>Cancel</Button>
          <Button onClick={handleConfirmClose} color="red">Yes</Button>
        </Group>
      </Modal>
    </>
  )
}
