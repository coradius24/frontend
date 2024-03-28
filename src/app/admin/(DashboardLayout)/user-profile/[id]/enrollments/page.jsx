"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import { useAdminContext } from "@/app/admin/AdminContext";
import enrollmentService from "@/services/enrollmentService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const SamplePage = ({ params }) => {
  const { isFeatureAvailable } = useAdminContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminEnrollmentsOfAUser", params.id],
    queryFn: () => enrollmentService.getEnrollmentsOfAUser(params.id),
  });

  const handleRemoveAccess = (id, courseName) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `you are removing "${courseName}" course access for this user`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        enrollmentService.removeEnrollment(id, params.id).then((res) => {
          if(res?.affected) {
            queryClient.invalidateQueries({
              queryKey: ["adminEnrollmentsOfAUser", params.id],
            });
            showToast("Enrollment removed!");
          } else {
            return showToast(res?.message, "error");
          }
          
        });
      }
    });
  };

  return (
    <PageContainer title="Course Enrollments" description="this is Sample page">
      <DataTableWithToolbar
        rows={data}
        isLoading={isPending}
        columns={[
          {
            key: "id",
            name: "ID",
          },

          {
            key: "courseTitle",
            name: "Course",
            template: (data) => (
              <Stack direction="row" spacing={2}>
                <Avatar
                  alt={data?.course?.title}
                  src={data.thumbnail}
                  sx={{ width: 40, height: 40, borderRadius: 0 }}
                />
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    {data?.course?.title}
                  </Typography>
                  <Typography variant="subtitle3" fontWeight="600">
                    Batch: {data?.course?.batchTitle || "Main"}
                  </Typography>
                </Box>
              </Stack>
            ),
          },

          {
            key: "createdAt",
            name: "Date",
            type: "datetime",
          },

          {
            key: "action",
            name: "",
            template: (row) => isFeatureAvailable('remove_enrollment', 'adminPaymentModule') ? (
              <Button
                sx={{ w: "200px" }}
                onClick={() => handleRemoveAccess(row.id, row.course?.title)}
                size="small"
                variant="contained"
                color="error"
              >
                Remove Access
              </Button>
            ): null,
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">Enrollments</Typography>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;
