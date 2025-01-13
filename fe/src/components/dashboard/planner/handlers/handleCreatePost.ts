import validator from 'validator';
import { DateValue } from '@mantine/dates';
import { convertTimeToUTC } from './handleConvertTime';
import { handleConvertContent } from './handleConvertContent';

export const handleCreatePost = async (
  title: string,
  content: string,
  label: string,
  datetime: DateValue,
  action: boolean,
  videoLinks: string[],
  pollOptions: string[],
  pollOptionsButton: boolean,
) => {

  // Validate and sanitize input
  if (validator.isEmpty(title)) { return "Title is required"; }
  if (validator.isEmpty(label)) { return "Please select a category"; }
  if (datetime === null) { return "Please select a date & time"; }
  if (videoLinks.length === 0 && validator.isEmpty(content)) { return "Content is required"; }
  if (pollOptionsButton){
    for (const option of pollOptions) {
      if (validator.isEmpty(option)) { return "Please fill out all poll options"; }
    }
  }

  // Sanitize input
  const sanitizedTitle = validator.escape(title);
  const sanitizedLabel = validator.escape(label);
  const sanitizedPollOptions = pollOptions.map(option => validator.escape(option));
  
  // Convert datetime to UTC
  const utcDate = convertTimeToUTC(datetime);
  
  // Convert content to Skool format
  const convertedContent = handleConvertContent(content);

  // Send post to backend
  const response = await fetch('/api/createpost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: sanitizedTitle,
      content: convertedContent,
      label: sanitizedLabel,
      datetime: utcDate,
      action: action,
      video_links: videoLinks,
      poll_selected: pollOptionsButton,
      poll_options: sanitizedPollOptions,
    }),
  });

  if (await response.ok) {
    return "Post created successfully";
  } else {
    const data = await response.json();
    const errorMessage = data.error;
    return "Error:" + errorMessage + " Please try again.";
  }
};