import { formatNumber } from "@/utils/lib";
import { Avatar, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import DashboardCard from "../shared/DashboardCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PayoutStats = ({
  isLoading,
  underReviewAmount,
  underReviewCount,
  waitingForPaymentAmount,
  waitingForPaymentCount,
  paidAmount,
  paidCount,
}) => {
  // chart color
  const theme = useTheme();

  // chart
  // chart
  const optionscolumnchart = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: ["#fff176", "#81d4fa", "#66bb6a"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
    labels: [`Under Reviews amount`, `Waiting amount`, `Paid amount`],
  };
  const seriescolumnchart = [
    underReviewAmount,
    waitingForPaymentAmount,
    paidAmount,
  ];

  const total = underReviewAmount + waitingForPaymentAmount + paidAmount;

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <DashboardCard title="Payouts">
          <Grid container spacing={3}>
            {/* column */}
            <Grid item xs={7} sm={7}>
              <Typography variant="h3" fontWeight="700">
                ${formatNumber(total)}
              </Typography>

              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: optionscolumnchart.colors[2],
                    color: optionscolumnchart.colors[2],
                    width: 14,
                    height: 14,
                  }}
                ></Avatar>

                <Typography variant="subtitle2" color="textSecondary">
                  Paid
                </Typography>
                <Typography variant="subtitle2" fontWeight="600">
                  ${formatNumber(paidAmount || 0)} ({paidCount || "0"})
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: optionscolumnchart.colors[0],
                    color: optionscolumnchart.colors[0],
                    width: 14,
                    height: 14,
                  }}
                ></Avatar>

                <Typography variant="subtitle2" color="textSecondary">
                  Under review
                </Typography>
                <Typography variant="subtitle2" fontWeight="600">
                  $ {formatNumber(underReviewAmount || 0)} (
                  {underReviewCount || "0"})
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: optionscolumnchart.colors[1],
                    color: optionscolumnchart.colors[1],
                    width: 14,
                    height: 14,
                  }}
                ></Avatar>

                <Typography variant="subtitle2" color="textSecondary">
                  Waiting
                </Typography>
                <Typography variant="subtitle2" fontWeight="600">
                  $ {formatNumber(waitingForPaymentAmount || 0)} (
                  {waitingForPaymentCount || "0"})
                </Typography>
              </Stack>
              {/* <Stack spacing={3} mt={5} direction="row">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                    ></Avatar>
                    <Typography variant="subtitle2" color="textSecondary">
                      2023
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}
                    ></Avatar>
                    <Typography variant="subtitle2" color="textSecondary">
                      2023
                    </Typography>
                  </Stack>
                </Stack> */}
            </Grid>
            {/* column */}
            <Grid item xs={5} sm={5}>
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height={180}
                width={"100%"}
              />
            </Grid>
          </Grid>
        </DashboardCard>
      )}
    </>
  );
};

export default PayoutStats;
