"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import enrollmentService from "@/services/enrollmentService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { useAdminContext } from "../../AdminContext";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import FilterPopover from "../components/shared/FilterPopover";
import CreateBulkEnrollmentModal from "./CreateBulkEnrollmentModal";
import CreatePaymentModal from "./CreatePaymentModal";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Enrollments",
  },
];

const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
    courseId: "",
  });
  const [searchValue, setSearchValue] = useState(() => query.search || "");
  const debouncedSearch = debounce((value) => {
    setQuery((prevQuery) => ({ ...prevQuery, page: 1, search: value }));
  }, 300);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminEnrollments", query],
    queryFn: () => enrollmentService.getAllEnrollmentsByAdmin(query),
  });

  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const removeEnrollment = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to remove course access (un enroll) of this user!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await enrollmentService.removeEnrollment(id);
          if (data?.statusCode === 400) {
            throw new Error("Something went wrong");
          }
          queryClient.invalidateQueries(["adminEnrollments"]);
          showToast(`Successfully unenroll!`);
        } catch (error) {
          showToast("Failed to update", "error");
        }
      }
    });
  };

  return (
    <PageContainer title="Course Enrollments" description="this is Sample page">
      <Breadcrumb title="Course Enrollments" items={BCrumb} />

      <DataTableWithToolbar
        {...query}
        setQuery={setQuery}
        rows={data?.results}
        rowsCount={data?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          {
            key: "id",
            name: "ID",
          },
          {
            key: "user",
            name: "User",
            template: (data) => (
              <Stack component={Link} href={`/admin/user-profile/${data?.user?.id}/enrollments`} direction="row" spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {data?.user?.fullName}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {data?.user?.email}
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            key: "courseTitle",
            name: "Course",
            template: (data) => (
              <Stack direction="row" spacing={2}>
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
            key: "more",
            name: "Action",
            template: (data) => (
              <Button
                variant="contained"
                onClick={() => removeEnrollment(data.id)}
                color="error"
              >
                Remove Access
              </Button>
            ),
          },
        ]}
        renderLeftContent={() => (
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search ..."  
type="search"
            size="small"
            onChange={handleSearch}
            value={searchValue}
          />
        )}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            {isFeatureAvailable(
              "create_enrollment_by_admin",
              "adminPaymentModule"
            ) ? (
              <CreateBulkEnrollmentModal />
            ) : null}
            {isFeatureAvailable(
              "create_enrollment_by_admin",
              "adminPaymentModule"
            ) ? (
              <CreatePaymentModal />
            ) : null}
            <FilterPopover>
              <Box
                mt={"-10px"}
                mb={"15px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>Filter</Typography>
                <Typography
                  variant="button"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setQuery({
                      ...query,
                      courseId: "",
                    });
                  }}
                >
                  Clear
                </Typography>
              </Box>
              <Box mt="20px" mb={0} width={"250px"}>
                <CustomAutoComplete
                  name="courseId"
                  value={query.courseId}
                  onChange={({ target }) =>
                    setQuery({ ...query, courseId: target.value || "" })
                  }
                  options={courseNames?.map((course) => ({
                    label: `${course.title} ${course.batchTitle}`,
                    value: course.id,
                  }))}
                />
              </Box>
            </FilterPopover>
          </Stack>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;
