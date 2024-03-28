"use client";
import { Button } from "@/components/button/LinkButton";
import Input from "@/components/input/Input";
import CustomModal from "@/components/modal/CustomModal";
import useApp from "@/hooks/useApp";
import apiService from "@/services/api/apiService";
import { checkDocumentValidity, checkEmptyValue, showToast } from "@/utils/lib";
import { SweetAlert } from "@/utils/sweet-alert";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { MdVerified } from "react-icons/md";
import Select from "react-select";
import Tesseract from "tesseract.js";
import "./verify-account.css";

const options = [
  { value: "NID", label: "NID" },
  { value: "passport", label: "Passport" },
  { value: "birthCertificate", label: "Birth Certificate" },
];

const VerifyAccount = ({ children }) => {
  const { user, getLoginUser } = useApp();
  const isKycVerified = user?.isKycVerified;

  const ref = useRef(null);
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const [error, setError] = useState({
    fullName: null,
    dateOfBirth: null,
    address: null,
    postalCode: null,
    city: null,
    country: null,
  });
  const [userInfo, setUserInfo] = useState(() => ({
    fullName: user?.fullName,
    dateOfBirth: dayjs(user?.profile?.dateOfBirth).format("YYYY-MM-DD"),
    address: "",
    postalCode: "",
    city: "",
    country: "",
    verifyDocumentType: null,
  }));
  const {
    fullName,
    dateOfBirth,
    city,
    address,
    postalCode,
    country,
    verifyDocumentType,
  } = userInfo;
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState({
    1: {
      title: "Personal Information",
    },
    2: {
      title: "Additional Information",
    },
    3: {
      title: "Identity  Verification",
    },
    // 4: {
    //   title: `Upload Your ${verifyDocumentType.label} Photo`,
    // },
    5: {
      title: "Analyzing Document",
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBackFile, setSelectedBackFile] = useState(null);
  const [photoCount, setPhotoCount] = useState(1);

  const [documentVerification, setDocumentVerification] = useState({
    stage: "idle",
    progress: 0,
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleBackFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedBackFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleBackFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const stepHandler = (value) => {
    let updateStep = value + step;
    if (step === 1 && updateStep === 2) {
      const result = checkEmptyValue({ fullName, dateOfBirth });
      if (result) {
        setError({ ...error, [result.key]: result.message });
        return;
      } else {
        setError({ ...error, fullName: null, dateOfBirth: null });
      }
    } else if (step === 2 && updateStep === 3) {
      const result = checkEmptyValue({ address, postalCode, city });
      if (result) {
        setError({ ...error, [result.key]: result.message });
        return;
      } else {
        setError({
          ...error,
          address: null,
          postalCode: null,
          city: null,
        });
      }
    }
    if (step === 3 && value === 1) {
      if (!verifyDocumentType?.value) {
        return showToast("Please, select document type!", "error");
      }
    }
    if (updateStep > 5) {
      updateStep = 5;
    }
    if (updateStep <= 0) {
      updateStep = 1;
    }
    setStep(updateStep);
  };

  const handleSubmit = () => {
    if (step !== 4) {
      return;
    }
    if (documentVerification.stage === "analyzing") {
      return;
    }
    setStep(5);
    setDocumentVerification((prev) => ({
      progress: 0,
      ...prev,
      stage: "analyzing",
    }));
    Tesseract.recognize(selectedFile, "eng+ben", {
      logger: (m) =>
        setDocumentVerification((prev) => ({ ...prev, progress: m.progress })),
    })
      .then(async (result) => {
        // Get Confidence score
        let formData = new FormData(); //formdata object

        const config = {
          headers: { "content-type": "multipart/form-data" },
        };
        formData.append("documentType", userInfo.verifyDocumentType.value);
        formData.append("frontPhoto", selectedFile);
        formData.append("backPhoto", selectedBackFile);
        if (checkDocumentValidity(result?.data?.text)) {
          formData.append("meta", "b326b5062b2f0e69046810717534cb09");
          const result = await apiService.post("/api/users/kyc-document", formData, config);
          
          if(result?.ok) {
            setDocumentVerification((prev) => ({ ...prev, stage: "approved" }));
            setModalOpen(false);
          }else {
            setDocumentVerification((prev) => ({ ...prev, stage: "rejected" }));
            throw new Error(result?.message);

          }

        } else {
          formData.append("meta", "b325b5062b230e69046810717534cb09");
          const result =  await apiService.post("/api/users/kyc-document", formData, config);
          setDocumentVerification((prev) => ({ ...prev, stage: "rejected" }));
          throw new Error("Invalid document!");
        }
        getLoginUser();
        SweetAlert.fire({
          title: "Document Verified!",
          text: "Thanks for providing valid document, your account is verified!",
          icon: "success",
        });
        setModalOpen(false);
      })
      .catch((err) => {
        SweetAlert.fire({
          title: "Verification Failed!",
          text: "Failed to verify your document, please try again leter with valid and clear document image.",
          icon: "error",
        });
        setDocumentVerification((prev) => ({ ...prev, stage: "rejected" }));
        setModalOpen(false);
        setStep(1);
      });
  };
  if (!user) {
    return null;
  }
  if (isKycVerified) {
    return <MdVerified size={30} className="text-primary" />;
  }

  return (
    <>
      <CustomModal
        containerClass={"account-verify-modal"}
        title={step !== 5 && "আপনার একাউন্টটি ভেরিফাই করুন।"}
        handleModalOpen={() => setModalOpen(true)}
        handleModalClose={() => setModalOpen(false)}
        modalIsOpen={modalOpen}
        triggerButton={children || <Button text={"ভেরিফাই করুন "} />}
        noCloseIcon={step === 5}
      >
        <div className="account-verify-modal-content">
          {step != 5 && (
            <div className="header-info">
              <strong>
                {step === 4
                  ? `Upload Your ${verifyDocumentType.label} Photo`
                  : title[step].title}
              </strong>
              <p>
                নিরাপত্তার উদ্দেশ্যে, অনুগ্রহ করে নিশ্চিত করুন যে প্রদত্ত সমস্ত
                তথ্য আপনার অফিসিয়াল পরিচয় নথির সাথে হুবহু মেলে
              </p>
            </div>
          )}

          <form>
            <div className="account-verify-modal-body">
              {step === 1 && (
                <>
                  <Input
                    showLabel
                    required
                    value={fullName || ""}
                    onChangeHandler={onChangeHandler}
                    label={"আপনার পুরো নাম"}
                    name={"fullName"}
                    placeholder={"আপনার পুরো নাম"}
                    error={error.fullName}
                    helperText={error.fullName}
                  />
                  <Input
                    required
                    showLabel
                    value={dateOfBirth || ""}
                    onChangeHandler={onChangeHandler}
                    label={"জন্ম তারিখ"}
                    name={"dateOfBirth"}
                    type={"date"}
                    error={error.dateOfBirth}
                    helperText={error.dateOfBirth}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <Input
                    showLabel
                    required
                    value={address || ""}
                    onChangeHandler={onChangeHandler}
                    label={"Residential Address"}
                    name={"address"}
                    placeholder={"Residential Address"}
                    helperText={error.address}
                    error={error.address}
                  />
                  <div className="address flex">
                    <Input
                      required
                      showLabel
                      value={postalCode || ""}
                      onChangeHandler={onChangeHandler}
                      label={"Postal Code"}
                      name={"postalCode"}
                      placeholder={"Postal Code"}
                      helperText={error.postalCode}
                      error={error.postalCode}
                    />
                    <Input
                      required
                      showLabel
                      value={city || ""}
                      onChangeHandler={onChangeHandler}
                      label={"City"}
                      name={"city"}
                      placeholder={"City"}
                      helperText={error.city}
                      error={error.city}
                    />
                  </div>
                </>
              )}
              {step === 3 && (
                <div className="form-group document-type">
                  <label>Please select your document type</label>
                  <Select
                    name="verifyDocumentType"
                    onChange={(data) => {
                      setUserInfo((prev) => ({
                        ...prev,
                        verifyDocumentType: data,
                      }));
                    }}
                    placeholder="Select"
                    value={verifyDocumentType}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#F2FCF3",
                        primary: "#19891C",
                      },
                    })}
                    required
                    options={options}
                  />
                </div>
              )}
              {step === 4 && (
                <>
                  <div className="photo-upload">
                    <p>আপনার ডকুমেন্ট এর স্ক্যান কপি অথবা ছবি আপলোড করুন</p>
                    {verifyDocumentType.value === "NID" && (
                      <div className="mt-3">
                        <div className="form-check-group">
                          <div className="form-check">
                            <input
                              onChange={() => setPhotoCount(1)}
                              checked={photoCount === 1}
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="flexRadioDefault2"
                            >
                              ফ্রন্ট,ব্যাক একসাথে একটি ডকুমেন্ট
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              onChange={() => setPhotoCount(2)}
                              checked={photoCount === 2}
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor="flexRadioDefault1"
                            >
                              ফ্রন্ট,ব্যাক পৃথক পৃথক ছবি
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="upload-aria">
                      <div
                        className="drop-zone"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                      >
                        {selectedFile && (
                          <img
                            className="preview-img"
                            src={URL.createObjectURL(selectedFile)}
                            alt="Selected Files"
                          />
                        )}
                        {photoCount == 2 && <p>ফ্রন্ট পার্ট</p>}

                        <p>
                          Drag and drop file <br />
                        </p>
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
                        <span> Browse files</span>
                      </label>
                    </div>
                    {photoCount == 2 && (
                      <div className="upload-aria">
                        <div
                          className="drop-zone"
                          onDrop={handleBackFileDrop}
                          onDragOver={handleDragOver}
                        >
                          {selectedBackFile && (
                            <img
                              className="preview-img"
                              src={URL.createObjectURL(selectedBackFile)}
                              alt="Selected Files"
                            />
                          )}
                          <p>ব্যাক পার্ট</p>
                          <p>
                            Drag and drop file <br />
                          </p>
                        </div>

                        <input
                          style={{ display: "none" }}
                          id="file-upload-2"
                          type="file"
                          accept="image/*"
                          onChange={handleBackFileSelect}
                          multiple
                        />
                        <label htmlFor="file-upload-2">
                          <span> Browse files</span>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="instructions">
                    <p>
                      Ensure that the document meet all the standards below:
                    </p>
                    <ul>
                      <li>পঠনযোগ্য ক্লিয়ার ইমেজ</li>
                      <li>সলিড ব্যাকগ্রাউন্ড</li>
                      <li>ইমেজ ফরম্যাট: jpeg, jpeg, png</li>
                      <li>সর্বোচ্চ ফাইল সাইজ: 5 MB</li>
                    </ul>
                  </div>
                </>
              )}
              {step === 5 && (
                <>
                  <div className="verifying-documents">
                    <h5>আপনার ডকুমেন্ট যাচাই হচ্ছে</h5>
                    <lottie-player
                      id="firstLottie"
                      ref={ref}
                      autoplay
                      // controls={false}
                      loop
                      mode="normal"
                      src="/animations/scan.json"
                      style={{ width: "300px", height: "300px" }}
                    ></lottie-player>

                    <progress value={documentVerification.progress} max="1">
                      {" "}
                    </progress>
                    <p>
                      অনুগ্রহ করে অপেক্ষা করুন, প্রক্রিয়াটি সর্বোচ্চ ৫ মিনিট
                      সময় নিবে
                    </p>
                  </div>
                </>
              )}
            </div>
            {step !== 5 && (
              <div className="footer-button">
                {step === 4 ? (
                  <Button
                    disabled={!selectedFile}
                    onClick={handleSubmit}
                    className="full-width"
                    text={"আপলোড করুন "}
                  />
                ) : (
                  <Button
                    onClick={() => stepHandler(+1)}
                    className="full-width"
                    text={"সাবমিট করে পরের পেইজে যান"}
                  />
                )}
                <Button
                  disabled={step == 1}
                  onClick={() => stepHandler(-1)}
                  className="full-width"
                  text={"পূর্বের পেইজে ফিরে যান "}
                />
              </div>
            )}
          </form>
        </div>
      </CustomModal>
    </>
  );
};

export default VerifyAccount;
