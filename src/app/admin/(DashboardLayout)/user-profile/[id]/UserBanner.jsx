"use client";
import {
  Avatar,
  Box,
  CardMedia,
  Fab,
  Grid,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconScriptPlus,
} from "@tabler/icons-react";

import { ROLE } from "@/constants";
import BlankCard from "../../components/shared/BlankCard";
import ProfileTab from "./ProfileTab";

const UserBanner = ({ userInfo, courseCount }) => {
  const { fullName, profile, photo, id, role } = userInfo || {};
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <>
      <BlankCard>
        <CardMedia
          component="img"
          image={"/admin/images/backgrounds/profilebg.jpg"}
          alt={"profilecover"}
          width="100%"
          height="330px"
        />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {/* Post | Followers | Following */}
          <Grid
            item
            lg={4}
            sm={12}
            md={5}
            xs={12}
            sx={{
              order: {
                xs: "2",
                sm: "2",
                lg: "1",
              },
            }}
          >
            <Stack
              direction="row"
              textAlign="center"
              justifyContent="center"
              gap={6}
              m={3}
            >
              <Box>
                <Typography color="text.secondary">
                  <IconScriptPlus width="20" />
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  {courseCount || "0"}
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  Course
                </Typography>
              </Box>
            </Stack>
          </Grid>
          {/* about profile */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: "1",
                sm: "1",
                lg: "2",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: "-85px",
              }}
            >
              <Box>
                <Stack sx={{ alignItems: "center" }} mt={1}>
                  <ProfileImage>
                    <Avatar
                      src={photo?.url}
                      alt={fullName}
                      sx={{
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        border: "4px solid #fff",
                      }}
                    />
                  </ProfileImage>
                  <Typography fontWeight={600} variant="h5">
                    {fullName}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight={400}
                  >
                    {ROLE[role]}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
          {/* friends following buttons */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: "3",
                sm: "3",
                lg: "3",
              },
            }}
          >
            <Stack
              direction={"row"}
              gap={2}
              alignItems="center"
              justifyContent="center"
              my={2}
            >
              {profile?.socialLinks?.facebook &&
                profile?.socialLinks?.facebook != "#" && (
                  <a
                    href={profile?.socialLinks?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    <Fab
                      size="small"
                      color="primary"
                      sx={{ backgroundColor: "#1877F2" }}
                    >
                      <IconBrandFacebook size="16" />
                    </Fab>{" "}
                  </a>
                )}
              {profile?.socialLinks?.twitter &&
                profile?.socialLinks?.twitter != "#" && (
                  <a
                    href={profile?.socialLinks?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    <Fab
                      size="small"
                      color="primary"
                      sx={{ backgroundColor: "#1DA1F2" }}
                    >
                      <IconBrandTwitter size="18" />
                    </Fab>{" "}
                  </a>
                )}

              {/* <Button color="primary" variant="contained">
                Add To Story
              </Button> */}
            </Stack>
          </Grid>
        </Grid>
        {/**TabbingPart**/}
        <ProfileTab userId={id} isStudent={role == 0} />
      </BlankCard>
    </>
  );
};

export default UserBanner;
