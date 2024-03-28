import { useAdminContext } from "@/app/admin/AdminContext";
import { ROLE } from "@/constants";
import userService from "@/services/userService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Chip, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import * as React from "react";
import ChildCard from "../../../components/shared/ChildCard";
import ChangePasswordModal from "./ChangePasswordModal";

function ProfileCard({ profile, userId, status, role }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [roleAnchorEl, setRoleAnchorEl] = React.useState(null);
  const roleMenuOpen = Boolean(roleAnchorEl);
  const handleRoleMenuClick = (event) => {
    setRoleAnchorEl(event.currentTarget);
  };
  const handleRoleMenuClose = () => {
    setRoleAnchorEl(null);
  };

  const { biography, dateOfBirth, skills, title } = profile || {};
  const { isFeatureAvailable } = useAdminContext();
  const handleUpdateUserStatus = (statusId) => {
    userService
      .updateUserAccountStatus(userId, { status: statusId })
      .then((res) => {
        if (res) {
          showToast("Successfully update!");
          queryClient.invalidateQueries(["adminSingleUserById", userId]);
        } else {
          showToast("Fail to update", "error");
        }
      });
  };

  const handleUpdateUserRole = (roleId) => {
    userService
      .updateUserAccountStatus(userId, { role: roleId })
      .then((res) => {
        if (res) {
          showToast("Successfully update!");
          queryClient.invalidateQueries(["adminSingleUserById", userId]);
        } else {
          showToast("Fail to update", "error");
        }
      });
  };
  let statusText = "Un Verified";
  let color = "warning";
  if (status === 1) {
    statusText = "Verified";
    color = "success";
  } else if (status == 3) {
    statusText = "Disabled";
    color = "error";
  }

  return (
    <ChildCard>
      <Typography fontWeight={600} variant="h4" mb={2}>
        Profile
      </Typography>
      <Box my={3}>
        <Typography fontWeight={600} variant="h6" mb={2}>
          Title
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: title || "--" }} />
      </Box>

      <Box my={3}>
        <Typography fontWeight={600} variant="h6" mb={2}>
          Biography
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: biography || "--" }} />
      </Box>
      <Box my={3}>
        <Typography fontWeight={600} variant="h6" mb={2}>
          Date Of Birth
        </Typography>
        {dateOfBirth ? dayjs(dateOfBirth).format("DD-MM-YYYY") : "--"}
      </Box>

      <Box direction="row" gap={2} alignItems="center" my={3}>
        <Typography variant="h6" mb={2}>
          Skills
        </Typography>
        <Stack
          direction="row"
          sx={{
            flexWrap: "wrap",
          }}
        >
          {skills
            ? skills
              ?.split(",")
              ?.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  sx={{ margin: "5px" }}
                  variant="outlined"
                />
              ))
            : "--"}
        </Stack>
      </Box>
      <Stack direction="row" spacing={3}>
        <Box my={3}>
          <Typography fontWeight={600} variant="h6" mb={2}>
            Account Status
          </Typography>
          <div>
            <Button
              title="Click to update user status"
              id="basic-button-status"
              aria-controls={open ? "basic-button-status" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={isFeatureAvailable('update_user', 'userManagementModule') ? handleClick : () => { }}
              disabled={!isFeatureAvailable('update_user', 'userManagementModule')}

            >
              <Chip color={color} label={statusText} />
            </Button>
            <Menu
              id="basic-button-status"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button-status",
              }}
            >
              <MenuItem
                onClick={isFeatureAvailable('update_user', 'userManagementModule') ? () => handleUpdateUserStatus(status === 3 ? 1 : 3) : () => { }}
              >
                {status === 3 ? "Active this Account" : "Disable this Account"}
              </MenuItem>
            </Menu>
          </div>
        </Box>
        <Box my={3}>
          <Typography fontWeight={600} variant="h6" mb={2}>
            Role
          </Typography>
          <div>
            <Button
              title="Click to update user status"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={isFeatureAvailable('update_user', 'userManagementModule') ? handleRoleMenuClick : () => { }}
              disabled={!isFeatureAvailable('update_user', 'userManagementModule')}

            >
              <Chip  label={ROLE[role]} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={roleAnchorEl}
              open={roleMenuOpen}
              onClose={handleRoleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              { role != 0 && <MenuItem
                onClick={isFeatureAvailable('update_user', 'userManagementModule') ? () => handleUpdateUserRole(0) : () => { }}
              >
                Student
              </MenuItem>}
              
              { role != 4 &&  <MenuItem
                onClick={isFeatureAvailable('update_user', 'userManagementModule') ? () => handleUpdateUserRole(4) : () => { }}
              >
                Admin
              </MenuItem>}
              { role != 1 &&  <MenuItem
                onClick={isFeatureAvailable('update_user', 'userManagementModule') ? () => handleUpdateUserRole(1) : () => { }}
              >
                Instructor
              </MenuItem>}
              
            </Menu>
          </div>
        </Box>
      </Stack>


      {isFeatureAvailable(
        "change_user_password_by_admin",
        "userManagementModule"
      ) && <ChangePasswordModal userId={userId} />}
    </ChildCard>
  );
}

export default ProfileCard;
