"use client";
import { forwardRef } from "react";
import ReactPlayer from "react-player/youtube";

const YoutubePlayer = forwardRef(function YoutubePlayer(props, ref) {
  return <ReactPlayer ref={ref} controls={true} url={props.url} />;
});

export default YoutubePlayer;
