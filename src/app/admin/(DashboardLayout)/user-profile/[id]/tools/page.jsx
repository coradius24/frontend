"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import { useAdminContext } from "@/app/admin/AdminContext";
import toolsService from "@/services/toolsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import AddToolsAccessModal from "./AddToolsAccessModal";

const SamplePage = ({ params }) => {
  const { isFeatureAvailable } = useAdminContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminToolsOfAUser", params.id],
    queryFn: () => toolsService.getToolsOfAUser(params.id),
  });

  const handleRemoveAccess = (id, toolName) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `you are removing "${toolName}" tool access for this user`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        toolsService.removeToolAccess(id, params.id).then((res) => {
          queryClient.invalidateQueries({
            queryKey: ["adminToolsOfAUser", params.id],
          });
          showToast("Access removed!");
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
            key: "name",
            name: "Name",
            template: (data) => (
              <Stack direction="row" spacing={2}>
                <Avatar
                  alt={data?.name}
                  src={data.thumbnail}
                  sx={{ width: 40, height: 40, borderRadius: 0 }}
                />
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    {data?.name}
                  </Typography>
                  <Typography variant="subtitle3" fontWeight="600">
                    #{data?.id}
                  </Typography>
                </Box>
              </Stack>
            ),
          },

          // {
          //   key: "link",
          //   name: "Date",
          //   type: "datetime",
          // },
          {
            key: "",
            name: "Action",
        "frontendSectionGroup": "adminToolsModule",
            template: (row) => isFeatureAvailable('remove_tool_access', 'adminToolsModule') ? (
              <Button
                onClick={() => handleRemoveAccess(row.id, row.name)}
                size="small"
                variant="contained"
                color="error"
              >
                Remove Access
              </Button>
            ): null,
          },
        ]}
        renderLeftContent={() => <Typography variant="h6">Tools</Typography>}
        renderAction={() => isFeatureAvailable('give_tools_access', 'adminToolsModule') ? <AddToolsAccessModal userId={params.id} /> : null}
      />
    </PageContainer>
  );
};

export default SamplePage;
