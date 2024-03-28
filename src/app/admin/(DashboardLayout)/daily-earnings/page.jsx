"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import earningService from "@/services/earningService";
import { formateDate, getQueryString } from "@/utils/lib";
import { isValidDate } from "@/utils/utils";
import {
  Box,
  InputAdornment,
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
import FilterPopover from "../components/shared/FilterPopover";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Student Earning Daily Report",
  },
];

const SamplePage = () => {
  const [query, setQuery] = useQueryParams({
    page: 1,
    limit: 10,
  });

  const [searchValue, setSearchValue] = useState(() => query.search || "");

  const debouncedSearch = debounce((value) => {
    setQuery((prevQuery) => ({ ...prevQuery, page: 1, search: value }));
  }, 300);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminDailyEarning", query],
    queryFn: () => earningService.getAdminDailyEarning(getQueryString(query)),
  });

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

  return (
    <PageContainer
      title="Student Earning Daily Report"
      description="this is Sample page"
    >
      <Breadcrumb title="Student Earning Daily Report" items={BCrumb} />
      <DataTableWithToolbar
        selectorKey={"id"}
        {...query}
        setQuery={setQuery}
        rows={data?.results}
        rowsCount={data?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          {
            key: "date",
            name: "Date",
            template: (row) => <>{formateDate(row.click_date)}</>,
          },
          {
            key: "user",
            name: "User ",
            template: (data) => (
              <Link href={`/admin/user-profile/${data.user_id}/earning-report`}>
                <Stack direction="row" spacing={2}>
                  {/* <Avatar src={data.user?.photo} sx={{ width: 40, height: 40 }} /> */}
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      userId #{data?.user_id}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle2">
                      {data?.email}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            ),
          },
          {
            key: "click_count",
            name: "Click",
          },
          {
            key: "earning",
            name: "Earning",
            template: (data) => (
              <Typography variant="h6">
                ${parseFloat(data.earning).toFixed(2)}
              </Typography>
            ),
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
              Total ({data?.totalCount || 0})
            </Typography>
          </Box>
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
