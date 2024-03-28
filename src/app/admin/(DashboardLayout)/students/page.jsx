"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
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
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Students",
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
    queryKey: ["adminUsers", query],
    queryFn: () => userService.getStudents(query),
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

  return (
    <PageContainer title="Students" description="this is Sample page">
      <Breadcrumb title="Students" items={BCrumb} />

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
              <Stack
                component={Link}
                href={`/admin/user-profile/${data?.id}/profile`}
                direction="row"
                spacing={2}
              >
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
          },

          {
            key: "isKycVerified",
            name: "KYC Status",
            type: "status",
            mapLabel: (value) => (value ? "Verified" : "Not Verified"),
          },

          {
            key: "createdAt",
            name: "Date",
            type: "datetime",
          },
          {
            key: "viewProfile",
            name: "",
            template: (data) =>
              isFeatureAvailable("get_user_by_id", "userManagementModule") ? (
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
            type="search"
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
