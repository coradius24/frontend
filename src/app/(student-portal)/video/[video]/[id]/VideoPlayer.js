"use client";
import { forwardRef, useRef } from "react";
import VimeoPlayer from "./VimeoPlayer";
import YoutubePlayer from "./YoutubePlayer";

const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const videoRef = useRef(null);

  const { videoType, videoUrl, cloudVideoId } = props.currentLesson;

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    props.updateWatchTime(currentTime);
  };
  if (videoType === "vimeo") {
    return <VimeoPlayer setPlayer={props.setPlayer} videoId={cloudVideoId} />;
  }
  if (videoType === "customUrl") {
    return (
      <video
        ref={videoRef}
        controls
        width="100%"
        preload="true"
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    );
  }
  return (
    <div className="youtube-video">
      <YoutubePlayer ref={ref} url={videoUrl} />
    </div>
  );
});

export default VideoPlayer;
