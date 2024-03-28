"use client";
import useApp from "@/hooks/useApp";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";

const ProfileImage = () => {
  const { user } = useApp();
  return (
    <>
      {user?.photo ? (
        <img
          height={30}
          width={30}
          src={user.photo.url}
          alt={user.fullName}
          className="img-fluid"
        />
      ) : (
        <RxAvatar size={28} />
      )}
    </>
  );
};

export default ProfileImage;
