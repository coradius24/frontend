"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import earningService from "@/services/earningService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { isValidDate } from "@/utils/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { debounce } from "lodash";
import Link from "next/link";
import { useState } from "react";
import FilterPopover from "../../components/shared/FilterPopover";
import PayoutReviewModal from "./PayoutReviewModal";
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "under reviews",
  },
];

const SamplePage = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState(() => query.search || "");
  const debouncedSearch = debounce((value) => {
    setQuery((prevQuery) => ({ ...prevQuery, page: 1, search: value }));
  }, 300);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminUnderReviewPayouts", query],
    queryFn: () =>
      earningService.getPayoutsOfStudents({
        ...query,
        isReviewed: false,
        status: "pending",
      }),
  });

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleApprove = async () => {
    setOpen(false);
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You want to approve it",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await earningService.reviewPaymentRequest(selectedItem.id, {
          reject: false,
          sendMail: true,
        });
        queryClient.invalidateQueries(["adminUnderReviewPayouts"]);
        showToast("Approve!");
      }
    });
  };

  const handleReject = async () => {
    setOpen(false);
    const { value: text } = await SweetAlert.fire({
      input: "textarea",
      inputLabel: "Reason for reject!",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: "Yes, Reject!",
    });

    if (text) {
      const res = await earningService.reviewPaymentRequest(selectedItem.id, {
        reject: true,
        reviewerMessage: text,
        sendMail: true,
      });
      if (res.success) {
        showToast("Updated");
        queryClient.invalidateQueries(["adminUnderReviewPayouts"]);
      } else {
        showToast(`Fail, ${res.message}!`, "error");
      }
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

  const handlePayout = (item) => {
    setOpen(true);
    setSelectedItem(item);
  };

  return (
    <PageContainer
      title="Waiting for Payments"
      description="this is Sample page"
    >
      <Breadcrumb title="Under reviews Payouts" items={BCrumb} />
      <PayoutReviewModal
        handleReject={handleReject}
        open={open}
        setOpen={setOpen}
        handleApprove={handleApprove}
        data={selectedItem}
      />
      <DataTableWithToolbar
        {...query}
        setQuery={setQuery}
        selectorKey={"email"}
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
              <Stack component={Link} href={`/admin/user-profile/${data?.user?.id}/wallet`}  direction="row" spacing={2}>
                {/* <Avatar src={data.user?.photo} sx={{ width: 40, height: 40 }} /> */}
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
            key: "amount",
            name: "Amount",
            template: (data) => (
              <Typography variant="h6">${data.amount}</Typography>
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
              <Button onClick={() => handlePayout(data)}>
                {" "}
                <RemoveRedEyeIcon size={18} />
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
            <FilterPopover>
              <Box
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
                      limit: query.limit,
                      page: query.page,
                      search: query.search,
                    });
                  }}
                >
                  Clear
                </Typography>
              </Box>
              <Stack direction="row" mt={2} content="end" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="start-date"
                    label="Start Date"
                    defaultValue={
                      query.startDate ? dayjs(query.startDate) : null
                    }
                    disableFuture
                    format="DD/MM/YYYY"
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
                    disableFuture
                    onChange={(value) => handleDateChange("endDate", value)}
                  />
                </LocalizationProvider>
              </Stack>
            </FilterPopover>
          </Stack>
        )}
        renderSelectAction={(selected) => (
          <Tooltip title="Delete">
            <IconButton>
              <IconTrash
                onClick={() => console.log("Delete", selected)}
                width="18"
              />
            </IconButton>
          </Tooltip>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;
