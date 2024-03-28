"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import toolService from "@/services/toolsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../AdminContext";
import { HtmlTooltip } from "../components/shared/UiFunction";
import CreateCouponModal from "./CreateTools";
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Tools",
  },
];

function transformArrayToObject(inputArray) {
  const resultObject = {};
  inputArray.forEach((item) => {
    const id = item.id;
    const title = item.title.trim();
    const batchTitle = item.batchTitle ? item.batchTitle.trim() : "";
    const value = batchTitle ? `${title} ${batchTitle}` : title;
    resultObject[id] = value;
  });

  return resultObject;
}

const SamplePage = () => {
  const [courses, setCourses] = useState({});
  const [open, setOpen] = useState(false);

  const [edit, setEdit] = useState(null);
  const [editId, setEditId] = useQueryState("edit");

  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminTools", query],
    queryFn: () => toolService.getAllToolsByAdmin(query),
  });

  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
    initialData: [],
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

  const handleDelete = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete this tools!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await toolService.deleteTool(id);
          if (data.statusCode === 400) {
            throw new Error("Something went wrong");
          }
          queryClient.invalidateQueries(["adminTools"]);
          showToast(`Successfully Delete!`);
        } catch (error) {
          showToast("Failed to update", "error");
        }
      }
    });
  };

  useEffect(() => {
    if (courseNames.length > 0) {
      const obj = transformArrayToObject(courseNames);
      setCourses(obj);
    }
  }, [courseNames]);

  return (
    <PageContainer title="Discount Tools" description="this is Sample page">
      <Breadcrumb title="Tools" items={BCrumb} />

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
            name: "Course",
            template: (row) => (
              <Typography>{getCourseName(courses, row.courseId)}</Typography>
            ),
          },
          {
            key: "createdAt",
            name: "Created At",
            type: "datetime",
          },
          {
            key: "id",
            name: "Action",
            type: "menu",
            menu: [
              {
                label: "Edit",
                icon: <IconEdit size={18} />,
                fn: (item, closeFn) => {
                  setEditId(item.id);
                  setEdit(item);
                  closeFn();
                },
              },
              {
                label: "Delete",
                icon: <IconTrash size={18} />,
                fn: (item, closeFn) => {
                  handleDelete(item.id);
                  closeFn();
                },
              },
            ],
          },
        ]}
        renderLeftContent={() => <Typography variant="h6"> Tools</Typography>}
        renderAction={() =>
          isFeatureAvailable("add_tool", "adminToolsModule") ? (
            <CreateCouponModal
              open={open}
              setOpen={setOpen}
              data={edit}
              editId={editId}
            />
          ) : null
        }
      />
    </PageContainer>
  );
};

export default SamplePage;

const getCourseName = (courses, courseIds) => {
  if (courseIds.length > 1) {
    const courseNames = courseIds.map((id) => {
      const courseId = parseInt(id);
      const courseName = courses[courseId];
      return courseName || "";
    });
    return (
      <HtmlTooltip
        title={
          <>
            {courseNames.map((item) => {
              return (
                <div key={item}>
                  <span>{item}</span> <br />
                </div>
              );
            })}
          </>
        }
      >
        {courses[courseIds[0]]}
      </HtmlTooltip>
    );
  } else {
    return courses[courseIds];
  }
};
