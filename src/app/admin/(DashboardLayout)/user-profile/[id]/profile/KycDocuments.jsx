import apiService from "@/services/api/apiService";
import { Chip, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import ChildCard from "../../../components/shared/ChildCard";

function KycDocuments({ userId }) {
  const { isPending, data: userDocuments } = useQuery({
    queryKey: ["adminUserKycDocuments", userId],
    queryFn: () => apiService.get(`/api/admin/users/${userId}/kyc-documents`),
  });
  const { frontPhoto, backPhoto, documentType, isDocumentValid } =
    userDocuments || {};
  return (
    <ChildCard>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={600} variant="h4" mb={2}>
          Documents
        </Typography>
        {userDocuments && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
            spacing={2}
          >
            <span> {documentType} </span>

            <Chip
              sx={{ opacity: 0.6 }}
              ml={2}
              variant="contained"
              label={isDocumentValid ? "Verified" : "Rejected"}
              color={isDocumentValid ? "primary" : "warning"}
            />
          </Stack>
        )}
      </Stack>
      {userDocuments ? (
        <Grid container>
          {frontPhoto?.url && (
            <Grid item>
              <img
                style={{ width: "100%" }}
                alt="Front"
                src={frontPhoto?.url}
              />
            </Grid>
          )}
          {backPhoto?.url && (
            <Grid item>
              <img style={{ width: "100%" }} alt="Back" src={backPhoto?.url} />
            </Grid>
          )}
        </Grid>
      ) : (
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "250px",
          }}
        >
          <Typography>Not submitted</Typography>
        </Stack>
      )}
    </ChildCard>
  );
}

export default KycDocuments;
