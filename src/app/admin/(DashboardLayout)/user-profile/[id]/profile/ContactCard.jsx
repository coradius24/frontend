import { useAdminContext } from "@/app/admin/AdminContext";
import userService from "@/services/userService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Stack, Typography } from "@mui/material";

import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import CustomOutlinedInput from "../../../components/forms/theme-elements/CustomOutlinedInput";
import ChildCard from "../../../components/shared/ChildCard";

const ContactCard = ({ email, userId, mobileNumber, address }) => {
  const [isEmailEditMode, setIdEmailEditMode] = useState(false)
  const [inputEmail, setInputEmail] = useState(email)
  useEffect(() => {
    setInputEmail(inputEmail)
  },[inputEmail])
  const { isFeatureAvailable } = useAdminContext();

  const handleUpdateUserEmail = () => {
    userService.updateUserAccountStatus(userId, {email: inputEmail})
      .then((res) => {
        if (res) {
          showToast("Successfully update email address!");
          setIdEmailEditMode(false)
          queryClient.invalidateQueries(["adminSingleUserById", userId]);
        } else {
          showToast("Fail to update email address", "error");
        }
      });
  };



  const handleCancel = () => {
    setIdEmailEditMode(false)
    setInputEmail(email)
  }
  return (
  <ChildCard>
    <Typography fontWeight={600} variant="h4" mb={2}>
      Contact
    </Typography>
    {isEmailEditMode ?  <Stack direction="row" gap={1} alignItems="center" mb={3}>
      <CustomOutlinedInput sx={{
        height: '30px',
        padding: '5px 0',
        flex: 1
      }} fullWidth value={inputEmail} onChange={({target}) => setInputEmail(target?.value)} />
       <IoIosCloseCircle onClick={handleCancel} style={{
        flexShrink: 0,
        fontSize: '1.2em'
      }} />
      <FaCheckCircle onClick={handleUpdateUserEmail} style={{
        flexShrink: 0
      }} />
    </Stack> :  <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconMail style={{
        flexShrink: 0
      }} size="21" />
      <Typography style={{
            overflowWrap: 'anywhere'
      }} variant="h6">{email}</Typography>
      {isFeatureAvailable('update_user', 'userManagementModule')  && <FaEdit onClick={() => setIdEmailEditMode(true)} style={{
        flexShrink: 0,
        right: '-20px'
      }} />}
      
    </Stack>}
   
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconPhone size="21" />
      <Typography variant="h6">
        {" "}
        {mobileNumber ? (
          <a href={`tel:${mobileNumber}`}>{mobileNumber}</a>
        ) : (
          "-"
        )}
      </Typography>
    </Stack>
    {address && (
      <Stack direction="row" gap={2} alignItems="center" mb={1}>
        <IconMapPin size="21" />
        <Typography variant="h6">{address}</Typography>
      </Stack>
    )}
  </ChildCard>
)};

export default ContactCard;
