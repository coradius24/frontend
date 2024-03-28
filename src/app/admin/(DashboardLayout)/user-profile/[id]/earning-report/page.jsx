"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import { useAdminContext } from "@/app/admin/AdminContext";
import useQueryParams from "@/hooks/useQueryParams";
import earningService from "@/services/earningService";
import { formateDate, showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";
import AddExtraClicks from "./AddExtraClicks";
import SmartLinkGeneration from "./SmartLinkGeneration";

const SamplePage = ({ params }) => {
  const { isFeatureAvailable } = useAdminContext();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useQueryState("edit");

  useEffect(() => {
    if (!open) {
      setEditId(null);
    }
  }, [open]);

  useEffect(() => {
    if (editId) {
      setOpen(true);
    }
  }, [editId]);

  const handleOpen = (id) => {
    setOpen(true);
    setEditId("");
  };

  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { isPending, data: data } = useQuery({
    queryKey: ["adminDailyReportOfAUser", params.id, query],
    queryFn: () => earningService.getEarningReportByUserId(params.id),
  });

  const { isPending: isSmartlinksLoading, data: smartLinks } = useQuery({
    queryKey: ["adminSmartLinksOfAUser", params.id],
    queryFn: () => earningService.geSmartLinksByUserId(params.id),
  });

  const handleShortLinkStatusChange = async (id, status) => {
    await earningService.updateShortLinkStatus(id, status)
    showToast("Smart link status updated!");
    queryClient.invalidateQueries(["adminSmartLinksOfAUser", id]);
  }

  return (
    <PageContainer title="Course Enrollments" description="this is Sample page">
      {isFeatureAvailable('smartlinks_of_a_user', 'userModule') && <Box mb={2}>
        
        <DataTableWithToolbar
          rows={smartLinks}
          isLoading={isSmartlinksLoading}
          columns={[
            {
              key: "url",
              name: "URL",
            },
            {
              key: "clicks",
              name: "Total Clicks",
              // type: "status"
            },
            {
              key: "revenue",
              name: "Revenue",
              type: "usd",
            },
            {
              key: "status",
              name: "Status",
              type: "status",
            },
             {
              key: "action",
              name: isFeatureAvailable('change_smart_link_status', 'userModule') ? "Action" : "",
              template: (data) => isFeatureAvailable('change_smart_link_status', 'userModule') ? (<Button onClick={() => handleShortLinkStatusChange(data?.id, data?.status === 'active' ? 'blocked': 'active')} variant="contained" color={data?.status === 'active' ? "error" : "success"}>{data?.status === 'active' ? "Block" : "Unblock"}</Button>): null
                
              
            },

          ]}
          renderLeftContent={() => (
            <Typography variant="h6">Smart Links</Typography>
          )}
          renderAction={() => {
            if(!isFeatureAvailable('generate_smart_link_for_user', 'userModule') ||  (isSmartlinksLoading || smartLinks?.length) ) {
              return null
            }
            return (
              <SmartLinkGeneration
                userId={params.id}
              />
            );
          }}
        />
      </Box>}
      {isFeatureAvailable('earning_report_of_a_user', 'userModule') && <DataTableWithToolbar
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
            template: (row) => (
              <Typography>{formateDate(row?.click_date)}</Typography>
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
          <Typography variant="h6">Daily Earning</Typography>
        )}
        renderAction={() => {
          if(!isFeatureAvailable('add_extra_click_to_shortner', 'userModule')) {
            return null
          }
          return (
            <AddExtraClicks
              userId={params.id}
              shortUrlSlug={smartLinks?.[0]?.url?.split("/")?.slice(-1)?.[0]}
            />
          );
        }}
      />}
      
    </PageContainer>
  );
};

export default SamplePage;
