"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import { baseURL } from "@/services/api/apiService";
import courseService from "@/services/courseService";
import enrollmentService from "@/services/enrollmentService";
import paymentService from "@/services/paymentService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { isValidDate } from "@/utils/utils";
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
import Swal from "sweetalert2";
import { useAdminContext } from "../../AdminContext";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import FilterPopover from "../components/shared/FilterPopover";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Due Payments",
  },
];

const init = {
  search: "",
  page: 1,
  limit: 10,
};

const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    ...init,
  });

  const [searchValue, setSearchValue] = useState(() => query.search || "");
  const debouncedSearch = debounce((value) => {
    setQuery((prevQuery) => ({ ...prevQuery, page: 1, search: value }));
  }, 300);

  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminDuePayments", query],
    queryFn: () => paymentService.getDuePayments(query),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleDateChange = (name, date) => {
    if (isValidDate(date)) {
      const dateObj = new Date(date);
      const timestamp = dateObj.toISOString();
      setQuery({
        ...query,
        [name]: timestamp,
      });
    }
  };

  const handleUnenrollSelected = async ({ ids }, cb) => {
    SweetAlert.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Remove",
      icon: "warning",
      text: "You are removing course access for selected students",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await enrollmentService.unenrollSelected(
            query.courseId,
            ids
          );
          showToast(
            `Just removed course access for ${res.affected} users!`,
            "success"
          );
          cb();
          queryClient.invalidateQueries(["adminDuePayments"]);
        } catch (error) {
          showToast("Failed to remove access!", "error");
        }
      }
    });
  };

  const handleUnenrollAll = async ({ ids, courseName }, cb) => {
    if (!query.courseId) {
      return SweetAlert.fire({
        title: "Please select a course first",
        text: "Please select a course from filter",
        icon: "info",
      });
    }
    SweetAlert.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Remove",
      icon: "warning",
      text: `You are removing course access for all due student for this course ${courseName}`,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await enrollmentService.removeAllDueStudentOfACourse(
            query.courseId
          );
          showToast(
            `Just removed course access for ${res.affected} users!`,
            "success"
          );
          cb();
          queryClient.invalidateQueries(["adminDuePayments"]);
        } catch (error) {
          showToast("Failed to remove access!", "error");
        }
      }
    });
  };

  const fetchCsvData = async () => {
    const params = {
      paymentMethod: query.paymentMethod,
      paymentStage: query.paymentStage,
    };

    if (query.startDate) {
      params.startDate = query.startDate;
    }
    if (query.endDate) {
      params.endDate = query.endDate;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/admin/payments/dues-download`,
        {
          credentials: "include",
        }
      );
      const filename = response.headers.get("customfilename");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      const blob = new Blob([data], { type: "attachment/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <PageContainer title="Due Payments" description="this is Sample page">
      <Breadcrumb title="Due Payments" items={BCrumb} />

      <DataTableWithToolbar
        selectable={query.courseId}
        selectorKey={"userId"}
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
              <Stack component={Link} href={`/admin/user-profile/${data?.user?.id}/profile`} direction="row" spacing={2}>

                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {data?.user?.fullName}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {data?.user?.email}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {data?.user?.mobileNumber}
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            key: "courseTitle",
            name: "Course",
            template: (data) => (
              <Typography variant="subtitle2">
                {data?.course?.title} {data?.course?.batchTitle}
              </Typography>
            ),
          },
          {
            key: "due",
            name: "Due",
            type: "bdt",
          },
        ]}
        renderLeftContent={() => (
          <Box display={"flex"} alignItems={"center"} gap={2}>
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
            <Typography variant="h6">
              Due Payments ({data?.totalCount})
            </Typography>
          </Box>
        )}
        renderSelectAction={(selected, unSelectSelected) => {
          return isFeatureAvailable(
            "bulk_unenroll_dues_selected",
            "adminPaymentModule"
          ) ? (
            <Button
              onClick={() =>
                handleUnenrollSelected({ ids: selected }, unSelectSelected)
              }
              size="small"
              variant="contained"
              color="error"
              sx={{
                width: "220px",
                background: "red",
              }}
            >
              Remove Course Access
            </Button>
          ) : (
            "No action available to perform"
          );
        }}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            <Stack spacing={1} direction="row">
              {isFeatureAvailable(
                "bulk_unenroll_all_dues",
                "adminPaymentModule"
              ) ? (
                <Button
                  sx={{ width: "175px" }}
                  size="small"
                  color="error"
                  onClick={() =>
                    handleUnenrollAll({
                      courseName: data?.[0]?.course?.title || "No course",
                    })
                  }
                  variant="contained"
                >
                  Remove All due's Access
                </Button>
              ) : null}
              {isFeatureAvailable(
                "payment_dues_download",
                "adminPaymentModule"
              ) && data?.totalCount ? (
                <Button
                  sx={{ width: "135px" }}
                  size="small"
                  onClick={fetchCsvData}
                  variant="contained"
                >
                  Download as CSV
                </Button>
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
                        ...init,
                      });
                    }}
                  >
                    Clear
                  </Typography>
                </Box>
                <Box mt="20px" mb={0} width={"250px"}>
                  <CustomAutoComplete
                    name="courseId"
                    placeholder="Select Course"
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
          </Stack>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;
