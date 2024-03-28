"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

function VideoModal({
  videoId,
  children,
  provider = "youtube",
  url,
  autoplay = true,
}) {
  const [isOpen, setOpen] = useState(false);
  const getComputedProps = () => {
    const props = {};
    return props;
  };

  return (
    <>
      <ModalPortal>
        <ModalVideo
          channel={provider}
          autoplay={autoplay}
          url={url}
          isOpen={isOpen}
          videoId={videoId}
          youtube={{
            autoplay: 1,
            mute: 0,
          }}
          onClose={() => setOpen(false)}
          {...getComputedProps()}
        />
      </ModalPortal>

      <div onClick={() => setOpen(true)} className="d-inline cursor-pointer">
        {children}
      </div>
    </>
  );
}

export function ModalPortal({ children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted ? createPortal(<>{children}</>, document.body) : null;
}

export default VideoModal;
