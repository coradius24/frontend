"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import { baseURL } from "@/services/api/apiService";
import paymentService from "@/services/paymentService";
import { isValidDate } from "@/utils/utils";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { debounce } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { useAdminContext } from "../../AdminContext";
import FilterPopover from "../components/shared/FilterPopover";
import CreatePaymentModal from "./CreatePaymentModal";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Payments",
  },
];

const init = {
  search: "",
  page: 1,
  limit: 10,
  paymentMethod: "all",
  paymentStage: "completed",
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

  const { isPending, error, data } = useQuery({
    queryKey: ["adminPayments", query],
    queryFn: () => paymentService.paymentHistoryByAdmin(query),
  });

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
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
        `${baseURL}/api/admin/payments/download?${new URLSearchParams(params)}`,
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

  return (
    <PageContainer title="Payment Histories" description="this is Sample page">
      <Breadcrumb title="Payment Histories" items={BCrumb} />

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
              <Stack
                direction="row"
                spacing={2}
                component={Link}
                href={`/admin/user-profile/${data?.user?.id}/payments-history`}
              >
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
              <Typography variant="subtitle2">
                {data?.course?.title} {data?.course?.batchTitle}
                <br />
                Price:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {data?.course?.price}TK
                </span>
              </Typography>
            ),
          },
          {
            key: "paymentMethod",
            name: "Payment Method",
          },
          {
            key: "amount",
            name: "Paid Amount",
            type: "bdt",
            template : (data) => <>
            <Typography>{data?.amount || "0"} TK</Typography>
            {data?.manuallyInsertedBy && <Link href={`/admin/user-profile/${data?.manuallyInsertedBy}/profile`}
              >
               Entry By #{data?.manuallyInsertedBy}
              </Link>}
            
            </>
          },
          {
            key: "due",
            name: "Due",
            type: "bdt",
          },

          {
            key: "discount",
            name: "Discount",
            template: (data) => (
              <Stack direction="column">
                <Typography variant="subtitle2">
                  {data?.discountAmount || 0} TK
                </Typography>
                {data?.couponApplied && (
                  <small>{data?.couponApplied}</small>
                )}
              </Stack>
            ),
          },
          
          {
            key: "paymentStage",
            name: "Status",
            type: "status",
          },
          {
            key: "createdAt",
            name: "Date time",
            type: "datetime",
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
            {isFeatureAvailable("create_payment_by_admin", "adminPaymentModule") ? (
              <CreatePaymentModal />
            ) : null}
            {isFeatureAvailable(
              "download_pre_registrations_data",
              "adminPreRegistrationModule"
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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Payment Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="paymentStage"
                  value={query.paymentStage}
                  label="Payment Status"
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value={"completed"}>Completed</MenuItem>
                  <MenuItem value={"initialized"}>Initialized</MenuItem>
                  <MenuItem value={"rejected"}>Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ mt: "15px" }} fullWidth>
                <InputLabel id="paymentMethod">Payment Method</InputLabel>
                <Select
                  labelId="paymentMethod"
                  id="demo-simple-select-paymentMethod"
                  name="paymentMethod"
                  value={query.paymentMethod}
                  label="Payment Status"
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  <MenuItem value={"bkashMerchantWeb"}>
                    Bkash MerchantWeb
                  </MenuItem>
                  <MenuItem value={"bkashManual"}>Bkash Manual</MenuItem>
                  <MenuItem value={"cash"}>Cash</MenuItem>
                  <MenuItem value={"nagadMerchantWeb"}>
                    Nagad Merchant Web
                  </MenuItem>
                  <MenuItem value={"shurjo_pay"}>Shurjo Pay</MenuItem>
                  <MenuItem value={"nagadManual"}>Nagad Manual</MenuItem>
                  <MenuItem value={"third_party_gateway"}>
                    Third Party gateway
                  </MenuItem>
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
      />
    </PageContainer>
  );
};

export default SamplePage;
