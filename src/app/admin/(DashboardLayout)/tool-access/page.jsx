"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import toolService from "@/services/toolsService";
import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../AdminContext";
import ToolsAccessModal from "./ToolsAccessModal";
import ToolsBulkAccessModal from "./ToolsBulkAccessModal";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Tools Access",
  },
];

const SamplePage = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useQueryState("edit");
  const { isFeatureAvailable } = useAdminContext();


  const [query, setQuery] = useQueryParams({
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminTools", query],
    queryFn: () => toolService.getAllToolsByAdmin(query),
  });

  useEffect(() => {
    if (!open) {
      setEditId(null);
    }
  }, [open]);

  useEffect(() => {
    if (editId) {
      setOpen(true);
    }
  }, [editId]);

  const handleOpen = (id) => {
    setOpen(true);
    setEditId(id);
  };

  return (
    <PageContainer title="Discount Tools" description="this is Sample page">
      <Breadcrumb title="Tools" items={BCrumb} />
      <ToolsAccessModal open={open} setOpen={setOpen} editId={editId} />
      <DataTableWithToolbar
        {...query}
        setQuery={setQuery}
        rows={data?.results}
        rowsCount={data?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          {
            key: "name",
            name: "Name",
            template: (row) => (
              <Stack direction={"row"} spacing={2}>
                <Avatar
                  src={row?.thumbnail?.url}
                  alt={row.name}
                  variant="rounded"
                  sx={{ width: 42, height: 42 }}
                />
                <Box>
                  <Typography>{row.name}</Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <strong> #{row.id} </strong>
                    {row?.isFree && (
                      <Chip sx={{}} color="success" size="small" label="Free" />
                    )}
                  </Stack>
                </Box>
              </Stack>
            ),
          },
          {
            key: "courseId",
            name: "courseId",
            template: (data) => <>{data?.courseId?.join(', ')}</>
          },
          {
            key: "createdAt",
            name: "Created At",
            type: "datetime",
          },
          {
            key: "id",
            name: "Action",
            template: (row) => (
              <Button
                type="button"
                variant="contained"
                onClick={() => handleOpen(row.id)}
              >
                Give Access
              </Button>
            ),
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6"> Tools ({data?.totalCount})</Typography>
        )}
        renderAction={() =>
          isFeatureAvailable("give_tools_access_in_bulk", "adminToolsModule") ? (
            <ToolsBulkAccessModal
              open={open}
              setOpen={setOpen}
            />
          ) : null
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
