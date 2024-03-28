"use client";
import { ThemeSettings } from "@/utils/admin/theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import NextTopLoader from "nextjs-toploader";

// import NextNProgress from "nextjs-progressbar";
import usePageTitle from "@/hooks/usePageTitle";
import { NextAppDirEmotionCacheProvider } from "@/utils/admin/theme/EmotionCache";
import { queryClient } from "@/utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import AdminContextProvider from "./AdminContext";
import "./admin.css";

export const MyApp = ({ children }) => {
  const theme = ThemeSettings();
  const pageTitle = usePageTitle();

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <>
      <AdminContextProvider>
        <QueryClientProvider client={queryClient}>
          <NextTopLoader color="#19891c" />
          <NextAppDirEmotionCacheProvider options={{ key: "mui-style" }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </QueryClientProvider>
      </AdminContextProvider>
    </>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <>
          <Toaster />
          <MyApp children={children} />
        </>
      </body>
    </html>
  );
}
