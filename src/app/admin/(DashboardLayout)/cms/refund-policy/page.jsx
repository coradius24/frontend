"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useAdminContext } from "@/app/admin/AdminContext";
import cmsService from "@/services/cmsService";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ContentModal from "./ContentModal";
import "./page.css";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Refund Policy",
  },
];

const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["refund-policy"],
    queryFn: () => cmsService.getPageContent("refund-policy"),
    initialData: {},
  });

  return (
    <PageContainer title="Refund Policy" description="Refund Policy">
      <Breadcrumb title="Refund Policy" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item sm={12} lg={12}>
          <Stack direction="row" alignItems={"center"} mt={2}>
            <Box>
              <Typography variant="h3">Page Content</Typography>
            </Box>
            <Box ml="auto">
              <ContentModal />
            </Box>
          </Stack>
        </Grid>
        <Grid item sm={12} lg={12}>
          <div className="admin-privacy-policy">
            <div className="header">
              <h1>{data?.content?.title}</h1>
              <p>{data?.content?.subtitle}</p>
            </div>
            <div className="content">
              {data?.content?.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: data?.content?.content }}
                ></div>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default SamplePage;
