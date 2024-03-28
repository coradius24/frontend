import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, TextField, Box } from '@mui/material';
import { IconArrowUpLeft, IconGridDots } from '@tabler/icons-react';
import DashboardCard from "../shared/DashboardCard";
import { isValidDate, MONTH_DICT } from "@/utils/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import moment from "moment"
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import earningService from "@/services/earningService";


const ClickSpikes = () => {


  // chart color
  const [start, setStart] = useState(moment().subtract(12, 'd').toDate());
  const [end, setEnd] = useState(moment().toDate());
  const { isPending: isLoading, data, error } = useQuery({
    queryKey: ["clickSpikes", start, end],
    queryFn: () => earningService.dailySpikes({
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString()
    })
  });

  console.log("error", error)
  const handleDate = (date, update, updateParam) => {
    if (isValidDate(date)) {
      const dateObj = new Date(date);
      const timestamp = dateObj.toDateString();
      update(timestamp);
    }
  };


  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primaryLight = theme.palette.primary[100];
  // chart
  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    color: ["#ff1113"],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    markers: {
      size: 0,
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: data?.results?.map(d => `${d.clickDate?.split('-')[2]} ${MONTH_DICT[Number(d.clickDate?.split('-')[1])]}`),
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: 'clicks',
      color: primary,
      data: data?.results?.map(d => d.clickCount),
    },
  ];



  return (
    <>

      <DashboardCard title="Daily Earnings/clicks"
        // action={
        //   <>
        //     <Stack direction="row" content="end" spacing={1}>
        //       <LocalizationProvider dateAdapter={AdapterDayjs}>
        //         <DatePicker
        //           className="start-date"
        //           label="Start Date"
        //           defaultValue={dayjs(start)}
        //           format="DD/MM/YYYY"
        //           // defaultValue={dayjs('2022-04-17')}

        //           slotProps={{
        //             textField: { size: 'small', sx: { maxWidth: '150px' } },
        //           }}

        //           onChange={(value) =>
        //             handleDate(value, setStart, "start")
        //           }
        //         />
        //       </LocalizationProvider>
        //       <LocalizationProvider dateAdapter={AdapterDayjs}>
        //         <DatePicker
        //           className="end-date"
        //           label="End Date"
        //           format="DD/MM/YYYY"
        //           defaultValue={dayjs(end)}
        //           slotProps={{
        //             textField: { size: 'small', sx: { maxWidth: '150px' } },
        //           }}

        //           onChange={(value) => handleDate(value, setEnd, "end")}
        //         />
        //       </LocalizationProvider>


        //     </Stack>
        //   </>
        // }
      >
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} sm={8}>
            <Box className="rounded-bars">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="area"
                height={240}
                width={"100%"}
              />
            </Box>
          </Grid>
          {/* column */}
          <Grid item xs={12} sm={4}>
            <Stack spacing={3} mt={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  width={40}
                  height={40}
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="primary" variant="h6" display="flex">
                    <IconGridDots size={24} />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight="700">
                    ${data?.totalEarning?.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Earnings
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Stack spacing={3} my={5}>
              <Stack direction="row" spacing={2}>
                {/* <Avatar
                  sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                ></Avatar> */}
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Earnings this month
                  </Typography>
                  <Typography variant="h5">${data?.currentMonth?.totalEarning?.toFixed(2) || '0'}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                {/* <Avatar
                  sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                ></Avatar> */}
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Clicks this month
                  </Typography>
                  <Typography variant="h5">{data?.currentMonth?.totalClickCount}</Typography>
                </Box>
              </Stack>
            </Stack>

          </Grid>
        </Grid>
      </DashboardCard>

    </>

  );
};

export default ClickSpikes;