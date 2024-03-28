"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import { useAdminContext } from "@/app/admin/AdminContext";
import useQueryParams from "@/hooks/useQueryParams";
import earningService from "@/services/earningService";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import WalletStats from "./WalletStats";
const SamplePage = ({ params }) => {
  const { isFeatureAvailable } = useAdminContext();

  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data: wallet } = useQuery({
    queryKey: ["adminWalletOfAUser", params.id, query],
    queryFn: () => earningService.getWalletByUserId(params.id),
  });

  const { isPending, data: payouts } = useQuery({
    queryKey: ["adminPayoutHistoryOfAUser", params.id, query],
    queryFn: () => earningService.gePayoutHistoryByUserId(params.id),
  });

  return (
    <PageContainer title="Course Enrollments" description="this is Sample page">
      {isFeatureAvailable('balance_of_a_user', 'userModule') && <WalletStats {...(wallet || {})} />}

      {isFeatureAvailable('payouts_of_a_user', 'userModule') && <DataTableWithToolbar
        {...query}
        setQuery={setQuery}
        rows={payouts?.results}
        rowsCount={payouts?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          {
            key: "id",
            name: "ID",
          },

          {
            key: "amount",
            name: "Amount",
            template: (data) => (
              <Typography variant="h6">${data.amount}</Typography>
            ),
          },
          {
            key: "status",
            name: "Status",
            type: "status",
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
            key: "createdAt",
            name: "Date",
            type: "datetime",
          },
        ]}
        renderLeftContent={() => <Typography variant="h6">Payments</Typography>}
      /> }
      
      
    </PageContainer>
  );
};

export default SamplePage;
