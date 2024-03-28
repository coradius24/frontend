"use client";
import useApp from "@/hooks/useApp";
import apiService from "@/services/api/apiService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsFacebook, BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";

const UserInfo = () => {
  const { startLoading, isLoading, stopLoading } = useLoading();
  const { user, getLoginUser } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeKB, setFileSizeKB] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [socialLinks, setSocialLinks] = useState(() => {
    return {
      twitter: "",
      facebook: "",
      linkedin: "",
      instagram: "",
    };
  });

  useEffect(() => {
    if (user) {
      setSocialLinks({
        ...user?.profile?.socialLinks,
      });
    }
  }, [user]);

  const { facebook, twitter, linkedin, instagram } = socialLinks;
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
      const fileSizeKB = Math.round(file.size / 1024);
      if (fileSizeKB > 500) {
        showToast("Please upload image within 250kb", "error");
      }
      setFileSizeKB(fileSizeKB);
    } else {
      setPreviewImage(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      startLoading();
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const config = {
          headers: { "content-type": "multipart/form-data" },
        };
        let response = await apiService.put(
          `/api/users/photo`,
          formData,
          config
        );
        response = await response.json();
        if (response.id) {
          setSelectedFile(null);
          setPreviewImage(null);
          getLoginUser();
          showToast("Photo Updated!");
        } else {
          showToast(response.message, "error");
        }
        stopLoading();
      } catch (error) {
        if (error.statusCode === 413) {
          showToast("File size too large, try less than 100kb", "error");
        }
        stopLoading();
      }
    }
  };

  let profileImage = user?.photo?.url || user?.federated?.picture;
  if (previewImage) {
    profileImage = previewImage;
  }
  return (
    <div className="profile-info-wrapper">
      <div className="profile-info flex">
        <div className="div">
          <div className="avatar">
            <Image
              alt={user?.fullName}
              height={142}
              width={142}
              src={profileImage || "/user.png"}
            />
            <div className="upload-icon">
              <MdOutlineCloudUpload size={30} />
              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {previewImage && (
            <button
              disabled={isLoading}
              onClick={handleUpload}
              className="btn upload-profile-image"
            >
              আপলোড করুন{" "}
            </button>
          )}
        </div>
        <div className="info">
          <h3>{user?.fullName}</h3>
          <span>{user?.profile?.title}</span>
        </div>
        <div className="social-profile flex">
          {facebook && (
            <div className="social-profile-item">
              <Link target="_blank" href={facebook}>
                <BsFacebook size={30} color="#3F403F" />
              </Link>
            </div>
          )}
          {instagram && (
            <div className="social-profile-item">
              <Link target="_blank" href={instagram}>
                {" "}
                <BsInstagram size={28} color="#3F403F" />
              </Link>
            </div>
          )}
          {linkedin && (
            <div className="social-profile-item">
              <Link target="_blank" href={linkedin}>
                {" "}
                <BsLinkedin size={27} color="#3F403F" />
              </Link>
            </div>
          )}
          {twitter && (
            <div className="social-profile-item">
              <Link target="_blank" href={twitter}>
                {" "}
                <FaSquareXTwitter size={30} color="#3F403F" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
