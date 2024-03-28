"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import earningService from "@/services/earningService";
import { getQueryString } from "@/utils/lib";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import Link from "next/link";
import { useState } from "react";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Student Earning Balance",
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
    queryKey: ["adminStudentEarningBalance", query],
    queryFn: () =>
      earningService.getAdminEarningReportBalance(getQueryString(query)),
  });

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <PageContainer
      title="Student Earning Balance"
      description="this is Sample page"
    >
      <Breadcrumb title="Student Earning Balance" items={BCrumb} />
      <DataTableWithToolbar
        selectorKey={"id"}
        {...query}
        setQuery={setQuery}
        rows={data?.results}
        rowsCount={data?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          // {
          //   key: "userId",
          //   name: "UserID",
          //   template:(data) => <Link href={`/admin/user-profile/${data?.userId}/earning-report`}> #{data?.userId}
          //   </Link>
          // },
          {
            key: "email",
            name: "User",
            template:(data) => <Link href={`/admin/user-profile/${data?.userId}/earning-report`}> {data?.email}
            <br />
            #{data?.userId}
            </Link>
          },
          {
            key: "totalEarnings",
            name: "Total Earnings",
            template: (data) => (
              <Typography variant="h6">${data.totalEarnings}</Typography>
            ),
          },
          {
            key: "withdrawnTotal",
            name: "Withdrawn Total",
          },
          {
            key: "currentBalance",
            name: "Current Balance",
            template: (data) => (
              <Typography variant="h6">${data.currentBalance}</Typography>
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
      />
    </PageContainer>
  );
};

export default SamplePage;
