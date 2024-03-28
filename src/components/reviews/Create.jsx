"use client";
import useApp from "@/hooks/useApp";
import { baseURL } from "@/services/api/apiService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GoStar, GoStarFill } from "react-icons/go";
import { MdVideoCameraFront } from "react-icons/md";
import { useReactMediaRecorder } from "react-media-recorder-2";
import { Button } from "../button/LinkButton";
import CustomModal from "../modal/CustomModal";
import "./create.css";
import MediaIcon from "/public/media.svg";

const Create = ({ courseId }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useApp();
  const [data, setData] = useState({
    comment: "",
    rating: 5,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedFile, setImage] = useState(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl,
  } = useReactMediaRecorder({
    video: true,
  });

  const handleStartRecording = () => {
    setModalOpen(true);
    clearBlobUrl();
    startRecording();
    setTimeout(() => {
      handleStopRecording();
    }, 180000);
  };

  const handleStopRecording = () => {
    stopRecording();
    setModalOpen(false);
  };

  const handleUploadVideo = async () => {
    try {
      startLoading();
      const formData = new FormData();

      formData.append("userId", user.id);
      formData.append("courseId", courseId);
      formData.append("rating", data.rating);
      formData.append("comment", data.comment);
      formData.append("status", "pending");

      if (selectedFile && !mediaBlobUrl) {
        formData.append("attachment", selectedFile);
      }

      if (mediaBlobUrl) {
        if (!selectedFile && thumbnail) {
          const file = base64ToFile(thumbnail);
          formData.append("videoThumbnail", file);
        }
        if (selectedFile) {
          formData.append("videoThumbnail", selectedFile);
        }
        const mediaBlob = await fetch(mediaBlobUrl).then((response) =>
          response.blob()
        );
        const myFile = new File([mediaBlob], "review.mp4", {
          type: "video/mp4",
        });
        formData.append("attachment", myFile);
        formData.append("attachmentType", "video");
      }

      const response = await fetch(`${baseURL}/api/reviews`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        throw Error(response);
      }
      await response.json();
      clearBlobUrl();
      setThumbnail(null);
      selectedFile(null);
      setData({ ...data, comment: "" });
    } catch (error) {
      console.error("Error uploading video and thumbnail:", error);
      // Handle error as needed
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    handleUploadVideo();
  };

  useEffect(() => {
    if (status === "recording") {
      showToast("Video record start!");
    } else if (status === "stopping" || status === "stopped") {
      showToast("Video record stop!");
    } else if (status === "permission_denied") {
      showToast("Allow to record video!", "error");
    } else if (status === "no_specified_media_found") {
      showToast("Camera not detected!", "error");
    } else if (status === "media_in_use") {
      showToast("Camera uses any other resource!", "error");
    }
  }, [status]);

  let title = "";
  if (status === "acquiring_media") {
    title = "ভিডিও রেকর্ড শুরু হচ্ছে ...";
  } else if (status === "recording") {
    title = "ভিডিও রেকর্ড হচ্ছে...";
  } else if (status === "stopped") {
    title = "ভিডিও রেকর্ড হয়েছে...";
  }
  return (
    <div className="review-create-card">
      <h1>একটি রিভিউ দিন</h1>
      <CustomModal
        containerClass={"account-verify-modal modal-video-review"}
        title={title}
        handleModalOpen={() => setModalOpen(true)}
        handleModalClose={() => setModalOpen(false)}
        modalIsOpen={modalOpen}
        noCloseIcon
      >
        <div className="account-verify-modal-content">
          <div className="video-recording-aria">
            {(status === "recording" || status === "acquiring_media") && (
              <VideoPreview
                setThumbnail={setThumbnail}
                stream={previewStream}
                status={status}
                thumbnail={thumbnail}
              />
            )}
          </div>
          {status === "recording" && (
            <Button
              text={"ভিডিও রেকর্ড বন্ধ করুন"}
              onClick={handleStopRecording}
              className="full-width"
            />
          )}
          {status === "stopped" && (
            <Button
              text={"ভিডিও প্রিভিউ বন্ধ করুন"}
              onClick={() => setModalOpen(false)}
              className="full-width"
            />
          )}
        </div>
      </CustomModal>
      <form onSubmit={submitHandler}>
        <div className="review-form-group flex">
          <div className="review upload-aria">
            <div className="drop-zone">
              {selectedFile && (
                <img
                  className="preview-img"
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Files"
                />
              )}
              {!selectedFile && thumbnail && (
                <img
                  className="preview-img"
                  src={thumbnail}
                  alt="Video Thumbnail"
                />
              )}
            </div>

            <input
              style={{ display: "none" }}
              id="file-upload"
              accept="image/*"
              type="file"
              onChange={handleFileSelect}
              multiple
            />

            <label htmlFor="file-upload">
              <span>
                {" "}
                ছবি আপলোড করুন <br />
                <Image src={MediaIcon} alt="image upload" />
              </span>
            </label>
          </div>
          <div className="review upload-aria">
            {mediaBlobUrl && (
              <video
                controls
                width="100%"
                height={"100%"}
                loop
                autoPlay
                playsInline
              >
                <source src={mediaBlobUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <label
              onClick={() => {
                if (status === "idle") {
                  handleStartRecording();
                } else if (status === "recording") {
                  handleStopRecording();
                } else if (status === "stopped") {
                  handleStartRecording();
                }
              }}
              className="video-icon"
            >
              {status === "idle" && <span> ভিডিও রেকর্ড করুন</span>}
              {status === "recording" && <span> ভিডিও রেকর্ড বন্ধ করুন</span>}
              {status === "stopped" && <span> পুনরায় রেকর্ড করুন </span>}
              <span>
                <MdVideoCameraFront color="#66697B" size={30} />
              </span>
            </label>
          </div>
        </div>
        <div className="review-form-group flex second">
          <div>
            <p className="review-star-label">কোর্সের রেটিং দিন </p>
            <ReviewStart setData={setData} data={data} />
          </div>
          <div className="comment">
            <textarea
              id="comment"
              aria-label="মন্তব্য:"
              className="form-control"
              name="comment"
              rows={4}
              required
              value={data.comment}
              onChange={(e) => setData({ ...data, comment: e.target.value })}
              placeholder="এখানে আপনার মন্তব্য লিখুন.... "
            />
          </div>
        </div>
        <div className="review-form-group flex">
          <div></div>
          <div>
            <Button
              disabled={isLoading}
              text={` ${isLoading ? "আপলোড হচ্ছে...." : "সাবমিট করুন"}`}
              type="submit"
              className="full-width"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;

const ReviewStart = ({ setData, data }) => {
  const [filledStars, setFilledStars] = useState(Array(5).fill(true));

  const handleStarClick = (index) => {
    const updatedStars = filledStars.map((_, i) => i <= index);
    setFilledStars(updatedStars);
    setData({ ...data, rating: index + 1 });
  };

  return (
    <div className="flex star-icons">
      {filledStars.map((filled, index) => (
        <span
          className="cursor-pointer"
          key={index}
          onClick={() => handleStarClick(index)}
        >
          {filled ? (
            <GoStarFill color="#19891C" size={30} />
          ) : (
            <GoStar color="#19891C" size={30} />
          )}
        </span>
      ))}
    </div>
  );
};

const VideoPreview = ({ stream, setThumbnail, status, thumbnail }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  const captureThumbnail = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setThumbnail(dataUrl);
    }
  };

  return (
    <video
      ref={videoRef}
      width={"100%"}
      height={"100%"}
      autoPlay
      controls
      onLoadedData={() => {
        if (status === "recording" && !thumbnail) {
          setTimeout(() => {
            captureThumbnail();
          }, 1000);
        }
      }}
    />
  );
};

const base64ToFile = (base64) => {
  const binaryString = atob(base64.split(",")[1]);
  // Convert binary string to ArrayBuffer
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  // Create a Blob from the ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  // Create a File from the Blob
  const file = new File([blob], "image.png", { type: "image/png" });
  return file;
};
