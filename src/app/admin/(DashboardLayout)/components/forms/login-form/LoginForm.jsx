import CustomFormLabel from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import useApp from "@/hooks/useApp";
import authService from "@/services/authService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import { Box, Button, FormGroup, Stack, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const AuthLogin = ({ title, subtitle, subtext }) => {
  const { login } = useApp();
  const params = useSearchParams();

  const callbackUrl = params.get("callbackUrl");
  const { isLoading, startLoading, stopLoading } = useLoading(false);
  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginPayload;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setLoginPayload({
      ...loginPayload,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        isAdministrativeRole: true,
      });

      if (res.error) {
        console.log("error", res.error)
        showToast("Email or password mis match!", "error");
      } else {
        await authService.getCurrentUser(getCookie("access_token"));
        if (callbackUrl && callbackUrl.includes("htt")) {
          const url = new URL(callbackUrl);
          return window.location.replace(url);
        } else if (callbackUrl) {
          return window.location.replace(
            `${window.location.origin}/${callbackUrl}`
          );
        }
        window.location.replace("/admin");
      }
    } catch (error) {
      console.log("error", error)

      showToast("Something wrong!", "error");
    } finally {
      stopLoading();
    }
  };
  return (
    <form onSubmit={submitHandler}>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            id="email"
            name="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={onChangeHandler}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            required
            value={password}
            onChange={onChangeHandler}
            fullWidth
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup></FormGroup>
          <Typography
            component={Link}
            href="/login/forgot_password_request"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </Button>
      </Box>
      {subtitle}
    </form>
  );
};

export default AuthLogin;
