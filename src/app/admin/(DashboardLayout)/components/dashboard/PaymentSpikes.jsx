import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, TextField } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from "../shared/DashboardCard";
import { isValidDate, MONTH_DICT } from "@/utils/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import moment from "moment"
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import paymentService from "@/services/paymentService";


const PaymentSpikes = () => {
  

  // chart color
  const [start, setStart] = useState(moment().subtract(15, 'd').toDate());
  const [end, setEnd] = useState(moment().toDate());
  const { isPending: isLoading, data, error } = useQuery({
    queryKey: ["paymentSpikes", start, end],
    queryFn: () => paymentService.paymentSpikes({
      startDate: new Date(start).toISOString(),
      endDate:new Date(end).toISOString()
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
      enabled: true,
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
      categories: data?.map(d => `${d.paymentDate?.split('-')[2]} ${MONTH_DICT[Number(d.paymentDate?.split('-')[1])]}`),
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: 'payments',
      color: '#81d4fa',
      data: data?.map(d => d.paymentAmount),
    },
  ];


  return (
    <>
      
          <DashboardCard title="Daily Payments"
            action={
              <>
                <Stack direction="row" content="end" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="start-date"
                label="Start Date"
                defaultValue={dayjs(start)}
                format="DD/MM/YYYY"
                // defaultValue={dayjs('2022-04-17')}
              
                slotProps={{
                  textField: { size: 'small', sx: { maxWidth: '150px' } },
                }}

                onChange={(value) =>
                  handleDate(value, setStart, "start")
                }
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="end-date"
                label="End Date"
                format="DD/MM/YYYY"
                defaultValue={dayjs(end)}
                slotProps={{
                  textField: { size: 'small', sx: { maxWidth: '150px' } },
                }}

                onChange={(value) => handleDate(value, setEnd, "end")}
              />
            </LocalizationProvider>
            

                </Stack>
              </>
            }
          >
            <Grid container spacing={3}>
              {/* column */}

              {/* column */}
              <Grid item xs={12} sm={12}>
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="area"
                  height={240}
                  width={"100%"}
                />
              </Grid>
            </Grid>
          </DashboardCard>
        
    </>

  );
};

export default PaymentSpikes;