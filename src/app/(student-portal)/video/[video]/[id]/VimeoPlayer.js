"use client";
import Player from "@vimeo/player";
import { useEffect, useRef } from "react";

const VimeoPlayer = ({
  videoId,
  autoplay = false,
  showTitle = false,
  showPortrait = false,
  setPlayer,
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const options = {
      id: videoId,
      autoplay,
      title: showTitle,
      portrait: showPortrait,
      width: 770,
    };
    let player = null;
    if (playerRef.current !== null) {
      player = new Player(playerRef.current, options);
      setPlayer(player);
    }
    return () => {
      player.destroy();
    };
  }, [videoId, autoplay, showTitle, showPortrait]);

  return <div ref={playerRef}></div>;
};

export default VimeoPlayer;
