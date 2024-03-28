"use client";
import Scrollbar from "@/app/admin/(DashboardLayout)/components/custom-scroll/Scrollbar";
import notificationService from "@/services/notificationService";
import { checkLang, dateWithTime } from "@/utils/lib";
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { IconBellRinging } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { Manager } from "socket.io-client";
let wasSocketEstablished = false;
const AdminNotifications = () => {
  const containerRef = useRef(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({
    notifications: [],
    total: 0,
    new: 0,
    nextCursor: null,
    isLoading: true,
  });
  const audioPlayer = useRef(null);

  const loadInitialNotificationData = async () => {
    try {
      const previousNotifications =
        await notificationService.getPreviousAdminNotifications();
      const newNotificationCount =
        previousNotifications.totalCount - previousNotifications.totalSeenCount;
      setNotificationData({
        ...notificationData,
        isLoading: false,
        notifications: previousNotifications.results,
        total: previousNotifications.totalCount,
        new: newNotificationCount > 0 ? newNotificationCount : 0,
        nextCursor: previousNotifications.nextCursor,
      });
    } catch (error) {
      console.error("Error loading initial notification data:", error);
    }
  };

  const playAudio = () => {
    try {
      audioPlayer.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleExpand = async () => {
    if (!isOpen) {
      try {
        await notificationService.updateNotificationSeen(notificationData.total);
        setNotificationData((prev) => ({
          ...prev,
          new: 0,
          totalSeenCount: prev.total,
        }));
      } catch (error) {
        console.error("Error updating notification seen:", error);
      }
    }
    setIsOpen(!isOpen);
  };

  const loadMoreNotification = async (cursor) => {
    if (!cursor || notificationData.isLoading) return;
    setNotificationData((prev) => ({ ...prev, isLoading: true }));

    try {
      const oldNotifications =
        await notificationService.getPreviousAdminNotifications(cursor);
      setNotificationData((prev) => ({
        ...prev,
        notifications: [
          ...prev.notifications,
          ...(oldNotifications?.results || []),
        ],
        nextCursor: oldNotifications.nextCursor,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error loading more notifications:", error);
      setNotificationData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSocketConnection = async () => {
    if (wasSocketEstablished) return;
    wasSocketEstablished = true;

    try {
      const manager = new Manager("wss://api.upspotacademy.com/", {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      const socket = manager.socket("/notifications", {});

      socket.on("connect", () => {
        socket.on("notification", (data) => {
          if (data.notificationType === "adminNotification") {
            setNotificationData((prev) => ({
              ...prev,
              notifications: [data, ...prev.notifications],
              total: prev.total + 1,
              new: prev.new + 1,
            }));
            playAudio();
          }
        });
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }
  };

  useEffect(() => {
    handleSocketConnection();
  }, []);

  useEffect(() => {
    loadInitialNotificationData();
  }, []);

  const handleMessageClick = (linkOrId) => {
    if (!linkOrId) return;
    if (Number(linkOrId)) {
      const page =
        Number.parseInt(
          notificationData?.notifications
            ?.filter((n) => n.notificationType == "notice")
            ?.findIndex((n) => n.linkOrId == linkOrId) / 5
        ) + 1;
      router.push(`/notices/?page=${page}&view=${linkOrId}`);
    } else {
      router.push(linkOrId);
    }
  };

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    handleExpand();
    setAnchorEl2(null);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: "85px",
        top: "12px",
        zIndex: 9999999,
      }}
    >
      {/* <audio ref={audioPlayer} />
       */}
      <audio
        ref={audioPlayer}
        src={
          "https://uploads.codesandbox.io/uploads/user/7f9e13d2-3bd6-418d-a05e-c989b824b268/PWHR-notification-sound.mp3"
        }
      />
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
      >
        {notificationData.new ? (
          <Badge badgeContent={notificationData.new} color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        ) : (
          <IconBellRinging size="21" stroke="1.5" />
        )}
      </IconButton>

      <Menu
        // onOpen={handleExpand}
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
          },
        }}
      >
        <Stack
          direction="row"
          py={2}
          px={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Notifications</Typography>
          {!!notificationData.new && (
            <Chip
              label={notificationData.new + " new"}
              color="primary"
              size="small"
            />
          )}
        </Stack>
        <Scrollbar sx={{ height: "385px" }}>
          <div className="content">
            {notificationData?.notifications?.map((notification, i) => (
              <Stack
                my={0.1}
                sx={{
                  alignItems: "center",
                  backgroundColor:
                    i < notificationData.new ? "#c2d3c021" : "unset",
                }}
                px={2}
                py={1}
                direction="row"
                className={`flex ${
                  notification?.linkOrId ? "clickable-notification" : ""
                }`}
                onClick={() => handleMessageClick(notification?.linkOrId)}
                key={i}
                spacing={1}
              >
                <div className="img">
                  {notification.notificationType === "notice" ? (
                    <span>
                      <Image
                        alt="Notice"
                        width="20"
                        height={16}
                        src={"/megaphone.png"}
                      />
                    </span>
                  ) : (
                    <span>
                      <AiFillBell color="#19891C" size={22} />
                    </span>
                  )}
                </div>
                <Box className="message" mb={1}>
                  <Typography
                    sx={{ mb: "2px" }}
                    className="notification-title"
                    data-lang={checkLang(notification.message)}
                  >
                    {notification.message}
                  </Typography>
                  {notification.body && (
                    <p className="notification-body">{notification.body}</p>
                  )}
                  <Typography
                    sx={{
                      fontSize: "12px",
                    }}
                  >
                    {dateWithTime(notification.deliveryTime)}
                  </Typography>
                </Box>
              </Stack>
            ))}
            {notificationData?.nextCursor && (
              <div>
                <Button
                  fullWidth
                  onClick={() =>
                    loadMoreNotification(notificationData?.nextCursor)
                  }
                  className="btn block btn-info"
                >
                  {notificationData.isLoading ? "Loading..." : "Load more..."}
                </Button>
              </div>
            )}
            {notificationData.isLoading &&
              notificationData?.notifications?.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Loading...
                </Box>
              )}
            {!notificationData.isLoading &&
              notificationData.notifications?.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    mt: "80px",
                  }}
                  className="no-data"
                >
                  <Image
                    width="100"
                    height="100"
                    src="/no-notification.png"
                    alt="No Notification"
                  />
                  <p>No notification yet!</p>
                </Box>
              )}
          </div>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default AdminNotifications;
