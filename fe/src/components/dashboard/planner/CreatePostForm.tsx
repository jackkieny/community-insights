import { 
    Modal,
    Button,
    Group,
    ComboboxItem,
} from '@mantine/core'
import { useState } from 'react'
import { DateValue } from '@mantine/dates';

import { Title } from './components/PostFormContent/Title';
import { Content } from './components/PostFormContent/Content';
import { DateTimeSelector } from './components/PostFormContent/DateTimeSelector';
import { LabelSelector } from './components/PostFormContent/LabelSelector';
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
        <Title title={title} setTitle={setTitle} />
        <Content content={content} setContent={setContent} />
        <Group justify='space-between' mt={15}>
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
            <LabelSelector label={label} setLabel={setLabel} />
            <DateTimeSelector datetime={datetime} setDatetime={setDatetime} />
          </Group>
        </Group>
        <Group justify='left'>

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
