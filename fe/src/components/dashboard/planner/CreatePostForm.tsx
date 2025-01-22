import {
  Modal,
  Button,
  Group,
  ComboboxItem,
  Flex,
} from '@mantine/core'
import { useState } from 'react'
import { DateValue } from '@mantine/dates';
import { useForm } from '@mantine/form'

import { handleCreatePost } from './handlers/handleCreatePost';
import { handleCheckReadyToSubmit } from './handlers/handleCheckReadyToSubmit';

import { Title } from './components/PostFormContent/Title';
import { Content } from './components/PostFormContent/Content';
import { DateTimeSelector } from './components/PostFormContent/DateTimeSelector';
import { LabelSelector } from './components/PostFormContent/LabelSelector';
import { ActionButton } from './components/PostFormMediaButtons/ActionButton';
import { FileAttachment } from './components/PostFormMediaButtons/FileAttachment';
import { Hyperlink } from './components/PostFormMediaButtons/Hyperlink';
import { EmbeddedVideoButton } from './components/PostFormMediaButtons/EmbeddedVideoButton';
import { Polls } from './components/PostFormMediaButtons/Polls';
import { Emoji } from './components/PostFormMediaButtons/Emoji';
import { GIFs } from './components/PostFormMediaButtons/GIFs';
import { PollForm } from './components/PostFormContent/PollForm';
import { VideoPreview } from './components/PostFormContent/VideoPreview';

interface CreatePostFormProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostForm({ open, onClose }: CreatePostFormProps) {

  interface FormValues {
    title: string;
    content: string;
    datetime: DateValue | null;
    label: ComboboxItem | null;
    videos: string[];
    videoIFrames: string[];
    pollOptions: string[];

    actionButtonSelected: boolean;
    pollButtonSelected: boolean;
    videoButtonSelected: boolean;
    emojiKeyobardSelected: boolean;

    datetimeError: string | null;
  }

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      content: '',
      datetime: null,
      label: null,
      videos: [],
      videoIFrames: [],
      pollOptions: new Array(2).fill(''),

      actionButtonSelected: false,
      pollButtonSelected: false,
      videoButtonSelected: false,
      emojiKeyobardSelected: false,

      datetimeError: null,
    }
  })

  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false)
  const handleCloseForm = () => {
    if (form.isDirty()) {
      setConfirmCloseOpen(true)
    } else {
      onClose()
    }
  }
  const handleCancelClose = () => { setConfirmCloseOpen(false); }
  const handleConfirmClose = () => {
    form.reset();
    setConfirmCloseOpen(false);
    onClose();
  }

  const readyToSubmit = handleCheckReadyToSubmit (
    form.values.title,
    form.values.content,
    form.values.label?.value as string,
    form.values.datetime,
    form.values.videos,
    form.values.pollButtonSelected,
    form.values.pollOptions,
  )
  
  return (
    <>
      <Modal
        opened={open}
        onClose={handleCloseForm}
        title="Create Post"
        size="75%"
        centered
      >
        <Group justify='space-between' grow>
          <Flex gap="md" direction="column" >
            <Title
              title={form.values.title}
              setTitle={(value) => form.setFieldValue('title', value)}
            />
            <Content
              content={form.values.content}
              setContent={(value) => form.setFieldValue('content', value)}
            />
          </Flex>
          <Group justify='right'>
            {form.values.pollButtonSelected ? 
              <PollForm 
                pollOptions={form.values.pollOptions}
                setPollOptions={(value) => form.setFieldValue('pollOptions', value)}
              /> : null}
          </Group>
        </Group>

        <Group justify='space-between' mt={15}>
          <Group>
            <FileAttachment />
            <Hyperlink />
            <EmbeddedVideoButton
              embeddedVideoSelected={form.values.videoButtonSelected}
              setEmbeddedVideoSelected={(value) => form.setFieldValue('videoButtonSelected', value)}
              videos={form.values.videos}
              setVideos={(value) => form.setFieldValue('videos', value)}
              videoIFrames={form.values.videoIFrames}
              setVideoIFrames={(value) => form.setFieldValue('videoIFrames', value)}
            />
            <Polls
              pollButtonSelected={form.values.pollButtonSelected}
              setPollButtonSelected={(value) => form.setFieldValue('pollButtonSelected', value)}
            />
            <ActionButton
              actionButtonSelected={form.values.actionButtonSelected}
              setActionButtonSelected={(value) => form.setFieldValue('actionButtonSelected', value)}
            />
            <Emoji />
            <GIFs />
          </Group>

          <Group justify='space-around'>
            <LabelSelector
              label={form.values.label}
              setLabel={(value) => form.setFieldValue('label', value)}
            />
            <DateTimeSelector
              datetime={form.values.datetime}
              setDatetime={(value) => form.setFieldValue('datetime', value)}
              datetimeError={form.values.datetimeError}
              setDatetimeError={(value) => form.setFieldValue('datetimeError', value)}
            />
          </Group>
        </Group>

        <Group justify='left' mt={20}>
          <VideoPreview
            videos={form.values.videos}
            setVideos={(value) => form.setFieldValue('videos', value)}
            videoIFrames={form.values.videoIFrames}
            setVideoIFrames={(value) => form.setFieldValue('videoIFrames', value)}
          />
        </Group>

        <Group justify='center'>
          <Button
            {...readyToSubmit ? {} : { disabled: true }}
            color='green'
            mt={25}
            fullWidth
            onClick={() => {
                handleCreatePost(
                    form.values.title,
                    form.values.content,
                    form.values.label?.value as string,
                    form.values.datetime,
                    form.values.actionButtonSelected,
                    form.values.videos,
                    form.values.pollOptions,
                    form.values.pollButtonSelected,
                ).then((response) => {
                    if (response !== 'Post created successfully') {
                      alert(response);
                    } else {
                      form.reset();
                      onClose();
                      alert(response);
                    }
                });
            }}>Create Post!</Button>
        </Group>

      </Modal>

      {/* Confirm Close */}
      <Modal
        opened={confirmCloseOpen}
        onClose={handleCancelClose}
        title="Confirm"
        style={{ textAlign: 'center' }}
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
