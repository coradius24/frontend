"use client";

import useApp from "@/hooks/useApp";

const LoginUserDropDown = () => {
  const { user } = useApp();
  let profileImage = user?.photo?.url || user?.federated?.picture;
  return (
    <div className="flex">
      <div className="user-image">
        <img src={profileImage || "/user.png"} alt="" />
      </div>
      <div className="user-details">
        <div className="user-name">
          <span className="hi">Hi,</span>
          {user?.fullName?.replace("null", "")}
        </div>
        <div className="user-email">
          <span className="email">{user?.email}</span>
          <span className="welcome">Welcome back</span>
        </div>
      </div>
    </div>
  );
};

export default LoginUserDropDown;
