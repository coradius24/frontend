"use client";
import { Box, Grid } from "@mui/material";

import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import earningService from "@/services/earningService";
import paymentService from "@/services/paymentService";
import { useQuery } from "@tanstack/react-query";
import ClickSpikes from "./components/dashboard/ClickSpikes";
import EnrollmentSpikes from "./components/dashboard/EnrollmentSpikes";
import PaymentSpikes from "./components/dashboard/PaymentSpikes";
import PaymentStats from "./components/dashboard/PaymentStats";
import PayoutStats from "./components/dashboard/PayoutStats";
import { useAdminContext } from "../AdminContext";

export default function Dashboard() {
  const  { isFeatureAvailable } = useAdminContext()
  const { isPending: payoutStatsLoading, data: payoutStats } = useQuery({
    queryKey: ["payoutStats"],
    queryFn: () => earningService.getPayoutStats(),
  });

  const { isPending: paymentStatsLoading, data: paymentsStats } = useQuery({
    queryKey: ["paymentStats"],
    queryFn: () => paymentService.paymentStats(),
  });
  
  const availableFeatures = {
    enrollmentSpikes : isFeatureAvailable('enrollments_line_chart', 'adminCharts'),
    paymentStats: isFeatureAvailable('payments_pie_chart', 'adminCharts'),
    payoutStats: isFeatureAvailable('payouts_pie_chart', 'adminCharts'),
    paymentSpikes: isFeatureAvailable('payments_line_chart', 'adminCharts'),
    clickSpikes: isFeatureAvailable('clicks_line_chart', 'adminCharts'),
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          {availableFeatures?.enrollmentSpikes && <Grid item xs={12} lg={12}>
            <EnrollmentSpikes />
          </Grid>}

          {availableFeatures?.paymentStats && <Grid item xs={12} lg={availableFeatures?.payoutStats ? 6 : 12}>
            <PaymentStats isLoading={paymentStatsLoading} {...paymentsStats} />
          </Grid>}
          
          {availableFeatures?.payoutStats && <Grid item xs={12} lg={availableFeatures?.paymentStats ? 6 : 12}>
            <PayoutStats isLoading={payoutStatsLoading} {...payoutStats} />
          </Grid>}

          {availableFeatures?.paymentSpikes && <Grid item xs={12} lg={12}>
            <PaymentSpikes />
          </Grid>}
          
          {availableFeatures?.clickSpikes && <Grid item xs={12} lg={12}>
            <ClickSpikes />
          </Grid>}
          
          

        </Grid>
      </Box>
    </PageContainer>
  );
}
