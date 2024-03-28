import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import * as dropdownData from "./data";

import { ROLE } from "@/constants";
import useApp from "@/hooks/useApp";
import apiService from "@/services/api/apiService";
import { Stack } from "@mui/system";
import { IconMail } from "@tabler/icons-react";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";

const Profile = () => {
  const { user } = useApp();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = async () => {
    await apiService.get("/api/auth/logout");
    deleteCookie("access_token");
    signOut();
  };
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={user?.photo?.url || '/admin/images/profile/user-1.jpg'}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={user?.photo?.url || '/admin/images/profile/user-1.jpg'}
            alt={"ProfileImg"}
            sx={{ width: 95, height: 95 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              fontWeight={600}
            >
              {user?.fullName}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.profile?.title || ROLE[user?.role]}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {user?.email?.length > 25
                ? user?.email?.slice(0, 22) + "..."
                : user?.email}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={profile.href || '#'}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: "240px",
                      }}
                    >
                      {profile.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: "240px",
                      }}
                      noWrap
                    >
                      {profile.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
