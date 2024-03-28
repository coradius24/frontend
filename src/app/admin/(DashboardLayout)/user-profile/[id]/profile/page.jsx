"use client";
import { useAdminContext } from "@/app/admin/AdminContext";
import userService from "@/services/userService";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ContactCard from "./ContactCard";
import KycDocuments from "./KycDocuments";
import ProfileCard from "./ProfileCard";

function Page({ params }) {
  const { isPending, data: userInfo } = useQuery({
    queryKey: ["adminSingleUserById", params.id],
    queryFn: () => userService.getUserById(params.id),
  });
  const { isFeatureAvailable } = useAdminContext();

  if (isPending) return <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        position: "absolute",
        zIndex: 999,
        top: 0,
        right: 0,
        minHeight: "100%",
        background: "#d8e0ed36",
      }}
    >
      <CircularProgress />
    </Box>
  </>
  return (
    <Grid container spacing={3}>
      {/* intro and Photos Card */}
      <Grid item sm={12} lg={4} xs={12}>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <ContactCard
              userId={params.id}
              email={userInfo?.email}
              mobileNumber={userInfo?.mobileNumber}
            />
          </Grid>
          <Grid item sm={12}>
            {isFeatureAvailable('get_kyc_documents_of_a_user', 'userManagementModule') && <KycDocuments userId={params.id} />}

          </Grid>
        </Grid>
      </Grid>
      {/* Posts Card */}
      <Grid item sm={12} lg={8} xs={12}>
        {isFeatureAvailable('get_user_by_id', 'userManagementModule') && <ProfileCard
          userId={userInfo?.id}
          status={userInfo?.status}
          profile={userInfo?.profile}
          role={userInfo?.role}
        />}

      </Grid>
    </Grid>
  );
}

export default Page;
