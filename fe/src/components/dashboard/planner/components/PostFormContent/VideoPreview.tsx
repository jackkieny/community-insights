import { Button } from '@mantine/core';
import classes from '../../styles/VideoPreview.module.css';

interface VideoPreviewProps {
  videos: string[];
  setVideos: (videos: string[]) => void;
  videoIFrames: string[];
  setVideoIFrames: (videoIFrames: string[]) => void;
}

export function VideoPreview({ videos, setVideos, videoIFrames, setVideoIFrames }: VideoPreviewProps) {
  return (
    <div className={classes.container}>
      {
        videoIFrames.map((video, index) => (
          <div key={index} className={classes.video_container}>
            <div className={classes.video}>
              <div dangerouslySetInnerHTML={{ __html: video }} />
              <Button
                color="red"
                size="xs"
                title='Remove'
                className={classes.button}
                onClick={() => {
                  setVideos(videos.filter((_, i) => i !== index));
                  setVideoIFrames(videoIFrames.filter((_, i) => i !== index));
                }}
              >X</Button>
            </div>
          </div>
        ))
      }
    </div>
  )
}