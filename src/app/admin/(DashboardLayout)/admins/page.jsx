"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import earningService from "@/services/earningService";
import userService from "@/services/userService";
import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { useAdminContext } from "../../AdminContext";
import AddStudentModal from "./AddStudentModal";
// import DashboardCard from "@/app/admin/(DashboardLayout)/components/shared/DashboardCard"
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Admins",
  },
];

const SamplePage = () => {
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminAdmins", query],
    queryFn: () => userService.getAdmins(query),
  });

  const [searchValue, setSearchValue] = useState(() => query.search || "");
  const debouncedSearch = debounce((value) => {
    setQuery((prevQuery) => ({ ...prevQuery, page: 1, search: value }));
  }, 300);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleApprove = async (id) => {
    await earningService.updatePayoutStatusByAdmin(id, {
      status: "paid",
    });
  };

  const mapStatus = (status) => {
    switch (status) {
      case 0:
        return "";
    }
  };

  return (
    <PageContainer title="Admins" description="this is Sample page">
      <Breadcrumb title="Admins" items={BCrumb} />

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
              <Stack component={Link} href={`/admin/user-profile/${data?.id}/profile`} direction="row" spacing={2}>
                <Avatar src={data?.photo?.url} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {data?.fullName}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {data?.email}
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            key: "mobileNumber",
            name: "Mobile Number",
            // template: (data) => (
            //   <Typography variant="subtitle2">
            //     {data?.course?.title} {data?.course?.batchTitle}
            //   </Typography>
            // ),
          },

          {
            key: "createdAt",
            name: "Date",
            type: "datetime",
          },
          {
            key: "viewProfile",
            name: "",
            template: (data) => isFeatureAvailable("get_user_by_id", "userManagementModule") ? (
              <Button
                size="small"
                color="secondary"
                variant={"outlined"}
                component={Link}
                href={`/admin/user-profile/${data.id}/profile`}
              >
                View Profile
              </Button>
            ) : null,
          },
        ]}
        renderLeftContent={() => (
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
        )}
        renderAction={() =>
          isFeatureAvailable("create_user", "userManagementModule") ? (
            <AddStudentModal />
          ) : null
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
