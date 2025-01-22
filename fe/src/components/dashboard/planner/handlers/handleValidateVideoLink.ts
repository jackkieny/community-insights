export const validateVideoLink = (videoLink: string): {isValid: boolean, videoType: string}=> {
  const patterns = {
    youtube: /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
    vimeo: /^https:\/\/(www\.)?vimeo\.com\/.+$/,
    loom: /^https:\/\/(www\.)?loom\.com\/.+$/,
    wistia: /^https:\/\/([a-zA-Z0-9]+)\.wistia\.com\//,
  };

  for (const [key, value] of Object.entries(patterns)) {
    if (value.test(videoLink)) {
      return { isValid: true, videoType: key };
    }
  }
  return { isValid: false, videoType: '' };
}

export const getVideoIFrame = async (linkType: string, embeddedLink: string): Promise<{ success?: string, html?: string, error?: string }> => {
  const youtubeUrl = 'https://www.youtube.com/oembed?format=json&url=';
  const vimeoUrl = 'https://vimeo.com/api/oembed.json?url=';
  const loomUrl = 'https://www.loom.com/v1/oembed?url=';
  const wistiaUrl = 'https://fast.wistia.com/oembed?format=json&url=';

  let url: string;

  switch (linkType) {
    case 'youtube':
      url = youtubeUrl + embeddedLink;
      break;
    case 'vimeo':
      url = vimeoUrl + embeddedLink;
      break;
    case 'loom':
      url = loomUrl + embeddedLink;
      break;
    case 'wistia':
      url = wistiaUrl + embeddedLink;
      break;
    default:
      return { error: 'Invalid link type' };
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return { html: data.html };
    } else {
      return {
        error: 'Failed to find video data. Double check the URL is correct and try again.'
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: `Network error: ${error.message}. Please check your browser setting and ensure that trackers are not being blocked. You can reenable the blockers after the video has uploaded.` };
    } else {
      return { error: 'An unknown error occurred' };
    }
  }
};
