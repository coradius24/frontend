import enrollmentService from "@/services/enrollmentService";
import { MONTH_DICT, isValidDate } from "@/utils/utils";
import { Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import moment from "moment";
import dynamic from "next/dynamic";
import { useState } from "react";
import DashboardCard from "../shared/DashboardCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EnrollmentSpikes = () => {
  // chart color
  const [start, setStart] = useState(moment().subtract(15, "d").toDate());
  const [end, setEnd] = useState(moment().toDate());
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["enrollmentSpikes", start, end],
    queryFn: () =>
      enrollmentService.getEnrollmentSpikes({
        startDate: new Date(start).toISOString(),
        endDate: new Date(end).toISOString(),
      }),
    initialData: [],
  });

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
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 280,
    },
    color: ["#ff1113"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
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
        columnWidth: "45%",
        distributed: true,
        endingShape: "rounded",
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
      categories: data?.map(
        (d) =>
          `${d.enrollmentDate?.split("-")[2]} ${
            MONTH_DICT[Number(d.enrollmentDate?.split("-")[1])]
          }`
      ),
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
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriescolumnchart = [
    {
      name: "Enrollments",
      color: primary,
      data: data?.map((d) => d.enrollmentCount),
    },
  ];

  return (
    <>
      <DashboardCard
        title="Enrollments"
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
                    textField: { size: "small", sx: { maxWidth: "150px" } },
                  }}
                  onChange={(value) => handleDate(value, setStart, "start")}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="end-date"
                  label="End Date"
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(end)}
                  slotProps={{
                    textField: { size: "small", sx: { maxWidth: "150px" } },
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

export default EnrollmentSpikes;
