"use client";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import "./ReviewMediaAttachment.css";
import ReviewVideoPlayer from "./ReviewVideoPlayer";

export const ReviewMediaAttachment = ({ data, isFeatured }) => {
  const isVideo =
    data.attachmentType === "video" || data?.attachment?.includes(".mp4");
  const { controls, src, thumbnail, alt, image } = isVideo
    ? {
        controls: true,
        src: data.attachment,
        thumbnail: data?.videoThumbnail,
      }
    : { image: data.attachment, alt: "review attachment" };


  return (
    <Box
      sx={{
        display: "flex",
        px: "24px",
        pb: "14px",
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {isVideo ? (
        // Display video with thumbnail
        <div
          className="preview-video-box"
          //  style={{  paddingTop: `${100 / aspectRatio}%` }}
        >
          {/* Video thumbnail */}
          <Image
            src={thumbnail}
            alt={alt || "attachment preview"}
            width={16 * 24}
            height={9 * 24}
          />
          {/* Video player */}
          <ReviewVideoPlayer videoUrl={src}>
            <div className="d-inline cursor-pointer">
              <span className="play-icon-container">
                <PlayCircleOutlineIcon fontSize="large" className="play-icon" />
              </span>
            </div>
          </ReviewVideoPlayer>
          {/* <VideoModal provider="custom" autoplay={false} url={src} >

                    </VideoModal> */}
        </div>
      ) : (
        // Display image
        <Box sx={{ flex: 1 }}>
          {image && (
            <Image
              src={image}
              alt={alt || "Card Image"}
              layout="responsive"
              width={640}
              height={360}
              // objectFit="contain"
              style={{
                width: 640,
                height: 360,
                // objectFit: "contain",
              }}
            />
          )}

          {/* {isFeatured && image && (
            <Box sx={{ textAlign: "center" }}>
              <Button onClick={() => setIsImageVisible((prev) => !prev)}>
                {isImageVisible ? "এটাচমেন্ট হাইড করুন" : "এটাচমেন্ট দেখুন"}
              </Button>
            </Box>
          )} */}
        </Box>
      )}
    </Box>
  );

  // return (
  //   <Card sx={{ display: "flex", maxWidth: "100%", width: "100%" }}>
  //     <CardMedia
  //       controls
  //       {...videoPros}
  //       component={`${isVideo ? "video" : "img"}`}
  //     />
  //   </Card>
  // );
};

export default ReviewMediaAttachment;
