import CustomModal from "@/components/modal/CustomModal";
import { useState } from "react";

const ReviewVideoPlayer = ({
  videoUrl,
  buttonText = "Play Video",
  children,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      padding: 0,
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
      <CustomModal
        style={{
          zIndex: "99999999",
        }}
        containerClass={"assignment-modal review-video-modal"}
        title={"স্টুডেন্ট রিভিউ"}
        handleModalOpen={() => setModalOpen(true)}
        handleModalClose={() => setModalOpen(false)}
        modalIsOpen={modalOpen}
        triggerButton={children}
      >
        <div className="modal-content center">
          <div style={{ maxWidth: 800, margin: "auto" }}>
            <div className="video-container">
              <video controls width="100%" height="auto">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </CustomModal>
      <div
        onClick={() => {
          setOpen(true);
        }}
      ></div>
    </>
  );
};

export default ReviewVideoPlayer;
