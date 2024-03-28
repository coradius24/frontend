"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import { baseURL } from "@/services/api/apiService";
import preRegistrationService from "@/services/preRegistrationService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { isValidDate } from "@/utils/utils";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAdminContext } from "../../AdminContext";
import FilterPopover from "../components/shared/FilterPopover";
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Pre Registrations",
  },
];

const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    isArchived: "false",
    page: 1,
    limit: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["adminPreRegistrations", query],
    queryFn: () => preRegistrationService.getAll(query),
  });

  const handleDownloadCsv = async () => {
    fetchCsvData();
  };

  const handleArchiveAll = async () => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You want to archive all data",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await preRegistrationService.archiveAll();
        queryClient.invalidateQueries(["adminPreRegistrations"]);
        showToast("Archived!");
      }
    });
  };

  const fetchCsvData = async (query) => {
    try {
      const response = await fetch(
        `${baseURL}/api/admin/pre-registrations/download?${new URLSearchParams(
          query
        )}`,
        {
          credentials: "include",
        }
      );
      const filename = response.headers.get("customfilename");

      // Parse the filename from the header

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

      // Clean up the URL.createObjectURL() to release resources
      URL.revokeObjectURL(url);
    } catch (error) {
      // handle error
      console.error("Error:", error);
    }
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

  const handleUpdate = async (body, unSelectSelected) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to ${body.isArchived ? "Archive" : "Restore"} ${
        body?.ids?.length
      } entries ${!body.isArchived ? "from Archive" : ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await preRegistrationService.update(body);
          if (data.statusCode === 400) {
            throw new Error("Something went wrong");
          }
          unSelectSelected();
          queryClient.invalidateQueries(["adminPreRegistrations"]);

          showToast(
            `${body.isArchived ? "Archived" : "Restored"} ${
              body?.ids?.length
            } entries ${!body.isArchived ? "from Archive" : ""}`
          );
        } catch (error) {
          showToast("Failed to update", "error");
        }
      }
    });
  };

  return (
    <PageContainer title="Pre registrations" description="this is Sample page">
      <Breadcrumb title="Pre Registrations" items={BCrumb} />

      <DataTableWithToolbar
        selectable
        selectorKey={"id"}
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
            key: "fullName",
            name: "Full Name",
          },
          {
            key: "mobileNumber",
            name: "Mobile Number",
            template: (data) => (
              <a href={`tel:${data.mobileNumber}`}>{data?.mobileNumber}</a>
            ),
          },

          {
            key: "email",
            name: "Email",
          },
          {
            key: "createdAt",
            name: "Submitted At",
            type: "datetime",
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">
            {query.isArchived === "true" ? "Archived" : "New"} Pre Registrations
            ({data?.totalCount || 0})
          </Typography>
        )}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            {isFeatureAvailable(
              "archive_pre_registrations",
              "adminPreRegistrationModule"
            ) &&
            query?.isArchived === "false" &&
            data?.totalCount ? (
              <Button
                color="error"
                sx={{ width: "90px" }}
                size="small"
                onClick={handleArchiveAll}
                variant="contained"
              >
                Archive All
              </Button>
            ) : null}
            {isFeatureAvailable(
              "download_pre_registrations_data",
              "adminPreRegistrationModule"
            ) && data?.totalCount ? (
              <Button
                sx={{ width: "130px" }}
                size="small"
                onClick={handleDownloadCsv}
                variant="contained"
              >
                Download as CSV
              </Button>
            ) : null}

            <FilterPopover>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Show</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="isArchived"
                  value={query.isArchived}
                  label="Show"
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value={"false"}>New</MenuItem>
                  <MenuItem value={"true"}>Archived</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" mt={3} content="end" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="start-date"
                    label="Start Date"
                    defaultValue={
                      query.startDate ? dayjs(query.startDate) : null
                    }
                    format="DD/MM/YYYY"
                    // defaultValue={dayjs('2022-04-17')}
                    onChange={(value) => handleDateChange("startDate", value)}
                    slotProps={{
                      textField: { size: "small", sx: { maxWidth: "150px" } },
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="end-date"
                    label="End Date"
                    format="DD/MM/YYYY"
                    defaultValue={query.endDate ? dayjs(query.endDate) : null}
                    slotProps={{
                      textField: { size: "small", sx: { maxWidth: "150px" } },
                    }}
                    onChange={(value) => handleDateChange("endDate", value)}
                  />
                </LocalizationProvider>
              </Stack>
            </FilterPopover>
          </Stack>
        )}
        renderSelectAction={(selected, unSelectSelected) =>
          isFeatureAvailable(
            "archive_single_pre_registration",
            "adminPreRegistrationModule"
          ) ? (
            <Tooltip
              title={
                query.isArchived === "false" ? "Mark as Archive" : "Restore"
              }
            >
              <Button
                onClick={() =>
                  handleUpdate(
                    { ids: selected, isArchived: query.isArchived === "false" },
                    unSelectSelected
                  )
                }
                size="small"
                variant="contained"
                color="error"
                sx={{
                  width: "130px",
                }}
              >
                {query.isArchived === "false" ? "Mark as Archive" : "Restore"}
              </Button>
            </Tooltip>
          ) : (
            "No action available to perform"
          )
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
