"use client";
import Scrollbar from "@/app/admin/(DashboardLayout)/components/custom-scroll/Scrollbar";
import { useAdminContext } from "@/app/admin/AdminContext";
import logo from "@/assets/img/header-logo.png";
import { customizer } from "@/utils/admin/theme/constants";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import SidebarItems from "./SidebarItems";
import { Profile } from "./SidebarProfile/Profile";

const Sidebar = () => {
  const {
    isSidebarCollapsed,
    isMobileSidebar,
    isSidebarHovered,
    setSidebarHover,
    setMobileSidebar,
  } = useAdminContext();

  const lgUp = useMediaQuery((theme) => theme?.breakpoints.up("lg"));
  const theme = useTheme();
  const toggleWidth =
    isSidebarCollapsed && !isSidebarHovered
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;

  const onHoverEnter = () => {
    if (isSidebarCollapsed) {
      setSidebarHover(true);
    }
  };

  const onHoverLeave = () => {
    setSidebarHover(false);
  };
  if (lgUp) {
    return (
      <Box
        sx={{
          zIndex: 100,
          width: toggleWidth,
          flexShrink: 0,
          ...(isSidebarHovered &&
            isSidebarCollapsed && {
              position: "absolute",
            }),
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          variant="permanent"
          PaperProps={{
            sx: {
              transition: theme.transitions.create("width", {
                duration: theme.transitions.duration.shortest,
              }),
              width: toggleWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box
              px={3}
              mt={2}
              style={{
                overflow:
                  isSidebarCollapsed && !isSidebarHovered
                    ? "hidden"
                    : "visible",
                width: 75,
              }}
            >
              <Image src={logo} width={150} alt="brand-logo" />
              {/* <Logo /> */}
            </Box>
            <Scrollbar sx={{ height: "calc(100% - 190px)" }}>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Scrollbar>
            <Profile />
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebar}
      onClose={() => setMobileSidebar(false)}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizer.SidebarWidth,

          // backgroundColor:
          //   customizer.activeMode === 'dark'
          //     ? customizer.darkBackground900
          //     : customizer.activeSidebarBg,
          // color: customizer.activeSidebarBg === '#ffffff' ? '' : 'white',
          border: "0 !important",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2} py={2}>
        <Image
          src={logo}
          width={165}
          className="my-2"
          height={62}
          alt="brand-logo"
        />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
    </Drawer>
  );
};

export default Sidebar;
