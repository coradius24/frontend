import { useAdminContext } from "@/app/admin/AdminContext";
import { ROLE } from "@/constants";
import useApp from "@/hooks/useApp";
import apiService from "@/services/api/apiService";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { IconPower } from "@tabler/icons-react";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import AdminNotifications from "../../header/Notification";

export const Profile = () => {
  const { isSidebarCollapsed, isSidebarHovered, toggleMobileSidebar } =
    useAdminContext();
  const { user } = useApp();

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp ? isSidebarCollapsed && !isSidebarHovered : "";
  const handleLogout = async () => {
    await apiService.get("/api/auth/logout");
    deleteCookie("access_token");
    signOut();
  };
  return (
    <Box
      display={"flex"}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${"secondary.light"}` }}
    >
      {/* <AdminNotifications /> */}
      {!hideMenu ? (
        <>
          <Avatar
            alt={user?.fullName?.split(" ")?.slice(-1)}
            src={user?.photo?.url || '/admin/images/profile/user-1.jpg'}
            sx={{ height: 40, width: 40 }}
          />

          <Box>
            <Typography variant="h6">
              {user?.fullName?.split(" ")?.slice(-1)}
            </Typography>
            <Typography variant="caption">
              {ROLE[user?.role]}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
