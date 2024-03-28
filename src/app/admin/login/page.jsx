"use client";
import AuthLogin from "@/app/admin/(DashboardLayout)/components/forms/login-form/LoginForm";
import logo from "@/assets/img/header-logo.png";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      sx={{ height: "100vh" }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        lg={7}
        xl={8}
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Box position="relative">
          <Box px={5}>
            <Box
              sx={{
                transform: "translateY(10px)",
              }}
            >
              <Link href="/" className="brand-logo mt-3">
                <Image src={logo} width={150} height={55} alt="brand-logo" />
              </Link>
            </Box>
          </Box>
          <Box
            alignItems="center"
            justifyContent="center"
            height={"calc(100vh - 75px)"}
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
          >
            <Image
              src={"/admin/images/backgrounds/login-bg.svg"}
              alt="bg"
              width={500}
              height={500}
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "500px",
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        lg={5}
        xl={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box p={4}>
          <AuthLogin
            title="Welcome to Upspot Academy"
            subtext={
              <Typography variant="subtitle1" color="textSecondary" mb={1}>
                Your Admin Dashboard
              </Typography>
            }
            subtitle={null}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

Login.layout = "Blank";
