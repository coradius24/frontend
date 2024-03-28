"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import useQueryParams from "@/hooks/useQueryParams";
import { baseURL } from "@/services/api/apiService";
import earningService from "@/services/earningService";
import { getQueryString } from "@/utils/lib";
import { isValidDate } from "@/utils/utils";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { experimentalStyled as styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { useAdminContext } from "../../../AdminContext";
import FilterPopover from "../../components/shared/FilterPopover";
import { getPaymentIcon } from "../../components/shared/UiFunction";

function camelCaseToNormal(str) {
  // Add a space before capital letters and convert the string to lowercase
  return str.replace(/([A-Z])/g, " $1").toLowerCase();
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  height: "100%",
  textAlign: "center",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Payouts",
  },
];

const init = {
  search: "",
  page: 1,
  limit: 10,
  status: "paid",
};
const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    ...init,
  });

  const [payoutStateQuery, setPayoutStateQuery] = useState({ timePeriod: "" });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminPayouts", query],
    queryFn: () => earningService.getPayout(getQueryString(query)),
  });

  const { data: payoutStats } = useQuery({
    queryKey: ["adminPayoutsStats", payoutStateQuery],
    queryFn: () => earningService.getPayoutStats(payoutStateQuery),
    initialData: {},
  });

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

  const dataArray = Object.keys(payoutStats)
    .map((key) => ({
      label: key,
      value: payoutStats[key],
    }))
    .filter((item) => item.label !== "statsOfSelectedTimePeriod");

  const filterDataArray = Object.keys(
    payoutStats.statsOfSelectedTimePeriod || {}
  ).map((key) => ({
    label: key,
    value: payoutStats.statsOfSelectedTimePeriod[key],
  }));

  return (
    <PageContainer title="Payouts Histories" description="this is Sample page">
      <Box sx={{ mb: 4 }}>
        <Box mb={2} mt={1} display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h6">All time:</Typography>
          <Box>
            {" "}
            <FilterPopover>
              <Box
                mt={"-10px"}
                mb={"15px"}
                sx={{ minWidth: "350px" }}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>Filter</Typography>
                <Typography
                  variant="button"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setPayoutStateQuery({
                      timePeriod: "",
                    });
                  }}
                >
                  Clear
                </Typography>
              </Box>
              <Box mt={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ margin: 0, padding: 0 }} id="timePeriod">
                    Time Period
                  </InputLabel>
                  <Select
                    labelId="timePeriod"
                    id="timePeriod"
                    label="Time Period"
                    name="timePeriod"
                    value={payoutStateQuery.timePeriod}
                    onChange={({ target }) =>
                      setPayoutStateQuery({
                        timePeriod: target.value,
                      })
                    }
                    size="small"
                  >
                    <MenuItem value={"today"}>Today</MenuItem>
                    <MenuItem value={"thisWeek"}>This Week</MenuItem>
                    <MenuItem value={"thisMonth"}>This Month</MenuItem>
                    <MenuItem value={"lastMonth"}>Last Month</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </FilterPopover>
          </Box>
        </Box>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {dataArray.map((dataItem) => {
            const isMoney = dataItem.label.includes("Amount");
            return (
              <Grid item xs={2} sm={4} md={3}>
                <Item>
                  <Typography
                    sx={{ textAlign: "left", marginBottom: "10px" }}
                    variant="subtitle2"
                  >
                    {camelCaseToNormal(dataItem.label)}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "left",
                      marginBottom: "10px",
                      fontSize: "20px",
                    }}
                    variant="h6"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    {isMoney ? <AttachMoneyIcon fontSize="medium" /> : ""}{" "}
                    {dataItem.value}
                  </Typography>
                </Item>
              </Grid>
            );
          })}
        </Grid>
        {payoutStateQuery.timePeriod && filterDataArray.length > 0 && (
          <>
            <Typography mt={3} mb={2} variant="h6">
              Filter Time Period Data:
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {filterDataArray.map((dataItem) => {
                const isMoney = dataItem.label.includes("Amount");
                return (
                  <Grid item xs={2} sm={4} md={3}>
                    <Item>
                      <Typography
                        sx={{ textAlign: "left", marginBottom: "10px" }}
                        variant="subtitle2"
                      >
                        {camelCaseToNormal(dataItem.label)}
                      </Typography>
                      <Typography
                        sx={{
                          textAlign: "left",
                          marginBottom: "10px",
                          fontSize: "20px",
                        }}
                        variant="h6"
                        display={"flex"}
                        alignItems={"center"}
                      >
                        {isMoney ? <AttachMoneyIcon /> : ""}{" "}
                        {isMoney ? dataItem.value * 100 : dataItem.value}
                      </Typography>
                    </Item>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Box>

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
              <Stack component={Link} href={`/admin/user-profile/${data?.user?.id}/wallet`} direction="row" spacing={2}>
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
            key: "payoutMethod",
            name: "Payment Method",
            template: (data) => <Box>{getPaymentIcon(data.payoutMethod)}</Box>,
          },
          {
            key: "amount",
            name: "Paid Amount",
            type: "usd",
          },
          {
            key: "ActionBy",
            name: "ActionBy",
            // type: "bdt",
            template : (data) => <>
            {data?.reviewerId && <Link href={`/admin/user-profile/${data?.reviewerId}/profile`}
              >
               Reviewer #{data?.reviewerId}
              </Link>}
              <br />
            {data?.actionTaker && <Link href={`/admin/user-profile/${data?.actionTaker}/profile`}
              >
               Payment Action By #{data?.actionTaker}
              </Link>}
            
            </>
          },
          {
            key: "status",
            name: "Status",
            type: "status",
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">Payouts ({data?.totalCount})</Typography>
        )}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            {/* {isFeatureAvailable(
              "download_pre_registrations_data",
              "adminPreRegistrationModule"
            ) && data?.totalCount ? (
              <Button
                sx={{ width: "150px" }}
                size="small"
                onClick={fetchCsvData}
                variant="contained"
              >
                Download as CSV
              </Button>
            ) : null} */}

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
