"use client";
import useApp from "@/hooks/useApp";
import accessControlService from "@/services/accessControlService";
import { SidebarWidth } from "@/utils/admin/theme/constants";
import { formatMyFeatures } from "@/utils/utils";
import {
  Box,
  CircularProgress,
  Container,
  styled,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useAdminContext } from "../AdminContext";
import Header from "./layout/header/Header";
import AdminNotifications from "./layout/header/Notification";
import Sidebar from "./layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

export default function RootLayout({ children }) {
  const router = useRouter();
  const { isSidebarCollapsed, loadFeatures } = useAdminContext();
  const theme = useTheme();
  const { data: session, status: sessionStatus } = useSession();

  const { user, isAuthenticated, authChecked, isLoginInProgress } = useApp();
  const [isLoading, setSetIsLoading] = useState(true);
  useLayoutEffect(() => {
    // todo  ((!isAuthenticated || user?.role == 0) && authChecked)
    if (
      sessionStatus === "unauthenticated" ||
      (sessionStatus === "authenticated" &&
        !isLoginInProgress &&
        user?.role === 0)
    ) {
      router.replace("/admin/login");
      return;
    }
    if (sessionStatus === "authenticated") {
      accessControlService.getMyFeatures().then((res) => {
        const myFeatures = formatMyFeatures(res);

        loadFeatures(myFeatures);
        if (authChecked) {
          setSetIsLoading(false);
        }
      });
    } else {
      // getLoginUser()
    }
  }, [sessionStatus, user, isLoginInProgress, authChecked]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainWrapper>
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(!isSidebarCollapsed && {
            [theme.breakpoints.up("lg")]: {
              ml: `${SidebarWidth}px`,
            },
          }),
        }}
      >
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header renderNotification={<></>} />
        <AdminNotifications />
        {/* PageContent */}
        <Container
          sx={{
            maxWidth: "100%!important",
          }}
        >
          {/* ------------------------------------------- */}
          {/* PageContent */}
          {/* ------------------------------------------- */}

          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            {/* <Outlet /> */}
            {children}
            {/* <Index /> */}
          </Box>

          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
