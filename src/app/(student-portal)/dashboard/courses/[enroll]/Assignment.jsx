"use client";
import CustomAccordion, { CustomAccordionItem } from "@/components/Accordion";
import { Button } from "@/components/button/LinkButton";
import CustomModal from "@/components/modal/CustomModal";
import apiService from "@/services/api/apiService";
import assignmentService from "@/services/assignmentService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import { Chip } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import {
  MdClose,
  MdOutlineAssignmentTurnedIn,
  MdOutlineCloudUpload,
} from "react-icons/md";
import "./assignment.css";

const Assignment = () => {
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [assignments, setAssignments] = useState([]);
  const [assignmentsSubmission, setAssignmentsSubmission] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionNote, setSubmissionNote] = useState("");
  const params = useParams();

  const fetchAssignmentData = () => {
    assignmentService.getAssignments(params.enroll).then((res) => {
      const data = res.map((item) => {
        return {
          id: item.id,
          heading: item.name,
          description: item.description,
        };
      });
      setAssignments(data);
    });

    assignmentService.getMySubmission(params.enroll).then((res) => {
      setAssignmentsSubmission(res);
    });
  };

  useEffect(() => {
    if (params) {
      fetchAssignmentData();
    }
  }, [params]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleUpload = async (id) => {
    try {
      startLoading();
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });
      formData.append("assignmentId", id);
      formData.append("submissionNote", submissionNote);
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const res = await apiService.post(
        `/api/assignments/submissions`,
        formData,
        config
      );
      if (res.id) {
        showToast("Assignment Submit Successfully");
        setModalOpen(false);
        setSelectedFiles([]);
      } else {
        showToast(res.message, "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      stopLoading();
      fetchAssignmentData();
    }
  };

  return (
    <div className="assignment">
      <CustomAccordion className="assignment-container">
        {assignments.map((item) => {
          const heading = (
            <div className="assignment-header flex">
              <div className="img">
                <MdOutlineAssignmentTurnedIn size={26} />
              </div>
              <div className="assignment-title">
                <p>{item.heading}</p>
              </div>
            </div>
          );
          const isSubmit = checkSubmit(item.id, assignmentsSubmission);
          return (
            <CustomAccordionItem
              key={item.id}
              item={{
                id: item.id,
                heading,
              }}
            >
              <div className="assignment-content">
                <div
                  className={`assignment-details${
                    isSubmit ? " submitted" : ""
                  }`}
                >
                  {" "}
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></div>{" "}
                </div>
                <div
                  className={`${
                    isSubmit ? "assignment-submitted" : "submit-button"
                  }`}
                >
                  {isSubmit ? (
                    <>
                      <div className="assignment-header flex">
                        <div className="img">
                          <BsPatchCheckFill color="#19891C" size={26} />
                        </div>
                        <span>
                          আপনার এসাইনমেন্ট সফলভাবে আপলোড হয়েছে, ধন্যবাদ।{" "}
                        </span>
                      </div>
                      <div className="assignment-submitted-info">
                        <div className="assignment-submitted-check flex align-center">
                          <p>Status:</p>
                          <span className="flex resubmit-assignment">
                            <GetStatus status={isSubmit.status} />
                          </span>
                          {isSubmit.status === "askedForResubmit" && (
                            <AssignmentSubmitModal
                              modalOpen={modalOpen}
                              setModalOpen={setModalOpen}
                              handleDragOver={handleDragOver}
                              handleFileDrop={handleFileDrop}
                              handleFileSelect={handleFileSelect}
                              handleUpload={handleUpload}
                              item={item}
                              submissionNote={submissionNote}
                              setSubmissionNote={setSubmissionNote}
                              isLoading={isLoading}
                              selectedFiles={selectedFiles}
                              buttonText="এসাইনমেন্ট আবার জমা দিন"
                              handleRemoveFile={handleRemoveFile}
                            />
                          )}
                        </div>
                        {isSubmit.status === "evaluated" ||
                          (isSubmit.status === "askedForResubmit" &&
                            isSubmit.remarks && (
                              <div className="assignment-submitted-feedback flex align-center">
                                <p>Feedback:</p>
                                <span>{isSubmit.remarks}</span>
                              </div>
                            ))}
                      </div>
                    </>
                  ) : (
                    <AssignmentSubmitModal
                      modalOpen={modalOpen}
                      setModalOpen={setModalOpen}
                      handleDragOver={handleDragOver}
                      handleFileDrop={handleFileDrop}
                      handleFileSelect={handleFileSelect}
                      handleUpload={handleUpload}
                      item={item}
                      submissionNote={submissionNote}
                      setSubmissionNote={setSubmissionNote}
                      isLoading={isLoading}
                      selectedFiles={selectedFiles}
                      handleRemoveFile={handleRemoveFile}
                    />
                  )}
                </div>
              </div>
            </CustomAccordionItem>
          );
        })}
      </CustomAccordion>
    </div>
  );
};

export default Assignment;

const checkSubmit = (id, assignments = []) => {
  return assignments.find((item) => item.assignmentId === id);
};

const AssignmentSubmitModal = ({
  item,
  handleUpload,
  setModalOpen,
  modalOpen,
  handleFileDrop,
  handleDragOver,
  handleFileSelect,
  selectedFiles = [],
  buttonText,
  isLoading,
  handleRemoveFile,
  submissionNote,
  setSubmissionNote,
}) => {
  return (
    <CustomModal
      containerClass={"assignment-modal"}
      title={"আপনার এসাইনমেন্ট আপলোড করুন "}
      handleModalOpen={() => setModalOpen(true)}
      handleModalClose={() => setModalOpen(false)}
      modalIsOpen={modalOpen}
      triggerButton={
        <Button
          className={`${buttonText ? "resubmit" : ""} btn-info`}
          text={buttonText || "এসাইনমেন্ট জমা দিন"}
          size={16}
        />
      }
    >
      <div
        className="modal-content center"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <div className="assignment-submit-icon">
          <MdOutlineCloudUpload size={84} color="#DBE1E5" />
        </div>

        <div className="drop-zone">
          <p>
            ড্র্যাগ এবং ড্রপ করে আপনার এসাইনমেন্ট <br />
          </p>
        </div>
        <input
          style={{ display: "none" }}
          id="file-upload"
          type="file"
          onChange={handleFileSelect}
          multiple
          accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .zip"
        />
        <label htmlFor="file-upload">
          আপলোড করুন <span>(Browse)</span>
        </label>
        <div className="uploaded-files">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item flex">
              <span>{file.name}</span>
              <span onClick={() => handleRemoveFile(index)}>
                <MdClose size={20} color="#000" />
              </span>
            </div>
          ))}
        </div>
        <div className="form-group-submission-note">
          <label htmlFor="submissionNote">Submission Note</label>
          <textarea
            id="submissionNote"
            aria-label="Note:"
            className="form-control"
            name="note"
            rows={4}
            onChange={({ target }) => setSubmissionNote(target.value)}
            value={submissionNote}
            placeholder="Note"
          />
        </div>
        <div className="assignment-submit-content">
          <Button
            disabled={(selectedFiles.length === 0 ? true : false) || isLoading}
            onClick={() => handleUpload(item.id)}
            text={"জমা দিন"}
            size={20}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export const GetStatus = ({ status }) => {
  if (status === "evaluated") {
    return <Chip label="Checked" color="success" />;
  } else if (status === "askedForResubmit") {
    return <Chip label="Checked" color="error" />;
  }
  return <Chip color="secondary" label="Waiting for review" />;
};
