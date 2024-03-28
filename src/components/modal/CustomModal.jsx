"use client";
import { IoIosClose } from "react-icons/io";
import Modal from "react-modal";
import "./custom-modal.css";
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

Modal.setAppElement("body");

function CustomModal({
  triggerButton,
  children,
  modalIsOpen,
  handleModalOpen: openModal,
  handleModalClose: closeModal,
  containerClass,
  style = {},
  title,
  noCloseIcon,
}) {
  return (
    <div>
      <span style={{ cursor: "pointer" }} onClick={openModal}>
        {triggerButton}
      </span>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          ...customStyles,
          content: { ...customStyles.content, ...style },
        }}
        contentLabel="Example Modal"
        className={containerClass}
        shouldCloseOnOverlayClick={false}
      >
        {title && (
          <div className="modal-title">
            <h3>{title}</h3>
          </div>
        )}
        {!noCloseIcon && (
          <button
            onClick={closeModal}
            type="button"
            className="close modal_close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">
              <IoIosClose size={24} />
            </span>
          </button>
        )}

        {children}
      </Modal>
    </div>
  );
}

export default CustomModal;
