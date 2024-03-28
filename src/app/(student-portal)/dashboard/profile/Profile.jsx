import AccountInfo from "./AccountInfo";
import Password from "./Password";
import SocialAccounts from "./SocialAccounts";
import UserInfo from "./UserInfo";

const Profile = () => {
  return (
    <>
      <UserInfo />
      <AccountInfo />
      <Password />
      <SocialAccounts />
    </>
  );
};

export default Profile;
