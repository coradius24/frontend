"use client";
import useApp from "@/hooks/useApp";
import { checkLang } from "@/utils/lib";

const ProfileImage = () => {
  const { user } = useApp();
  let profileImage = user?.photo?.url || user?.federated?.picture;
  return (
    <div className="user-box image-container flex">
      <div>
        <img
          width={"50px"}
          height={"50px"}
          src={profileImage || "/user.png"}
          alt={user?.fullName || "user profile image"}
          className="img-fluid"
        />{" "}
      </div>
      <div className="name">
        <span>স্বাগতম </span>
        <span data-lang={checkLang(user?.fullName)}>
          {user?.fullName?.replace("undefined", "")}
        </span>
      </div>
      <div className="notification-box">
        <img
          src={"/notification.svg"}
          height={24}
          width={24}
          alt="notification"
        />
      </div>
    </div>
  );
};

export default ProfileImage;
