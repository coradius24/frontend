"use client";
import "react-modal-video/scss/modal-video.scss";
import "./lesson-preview.css";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import VideoPlayer from "@/app/(student-portal)/video/[video]/[id]/VideoPlayer";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const LessonPreviewModal = ({ selected, isOpen, setOpen }) => {
  const [player, setPlayer] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  if (!selected) {
    return null;
  }

  return (
    <Dialog maxWidth="sm" fullWidth open={isOpen}>
      <DialogTitle>{selected?.title ?? null}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box minWidth={"90%"} maxWidth={"700px"}>
          {selected.lessonType === "upcomingLiveClass" ||
          selected.lessonType === "article" ? (
            <Typography>
              This is not a video lesson please choose a different lesson to
              preview a video
            </Typography>
          ) : (
            <div className="lesson-preview">
              {selected && (
                <VideoPlayer
                  player={player}
                  setPlayer={setPlayer}
                  currentLesson={selected}
                />
              )}
            </div>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LessonPreviewModal;
