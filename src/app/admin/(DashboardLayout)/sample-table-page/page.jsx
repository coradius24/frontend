"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import useQueryParams from "@/hooks/useQueryParams";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  IconEdit,
  IconFilter,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { debounce } from "lodash";
import { useState } from "react";
import DataTableWithToolbar from "../components/tables/DataTableWithToolbar";
import Breadcrumb from "../layout/shared/breadcrumb/Breadcrumb";
// import DashboardCard from "@/app/admin/(DashboardLayout)/components/shared/DashboardCard"
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sample Page",
  },
];

const rows = [
  {
    status: "active",
    avatar: "/images/profile/user-1.jpg",
    tag: "rhye",
    cname: "Olivia Rhye",
    email: "olivia@ui.com",
    teams: [
      { name: "Design", bgcolor: "primary.main" },
      { name: "Product", bgcolor: "secondary.main" },
    ],
  },
  {
    status: "offline",
    avatar: "/images/profile/user-2.jpg",
    tag: "steele",
    cname: "Barbara Steele",
    email: "steele0@ui.com",
    teams: [
      { name: "Product", bgcolor: "secondary.main" },
      { name: "Operations", bgcolor: "error.main" },
    ],
  },
  {
    status: "active",
    avatar: "/images/profile/user-3.jpg",
    tag: "gordon",
    cname: "Leonard Gordon",
    email: "olivia6@ui.com",
    teams: [
      { name: "Finance", bgcolor: "primary.main" },
      { name: "Customer Success", bgcolor: "success.main" },
    ],
  },
  {
    status: "pending",
    avatar: "/images/profile/user-4.jpg",
    tag: "pope",
    cname: "Evelyn Pope",
    email: "steele4@ui.com",
    teams: [
      { name: "Operations", bgcolor: "error.main" },
      { name: "Design", bgcolor: "primary.main" },
    ],
  },
  {
    status: "active",
    avatar: "/images/profile/user-5.jpg",
    tag: "garza",
    cname: "Tommy Garza",
    email: "olivia2@ui.com",
    teams: [{ name: "Product", bgcolor: "secondary.main" }],
  },
  {
    status: "rejected",
    avatar: "/images/profile/user-6.jpg",
    tag: "vasquez",
    cname: "Isabel Vasquez",
    email: "steele2@ui.com",
    teams: [{ name: "Customer Success", bgcolor: "success.main" }],
  },
];
const SamplePage = () => {
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
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
    <PageContainer title="Sample Page" description="this is Sample page">
      <Breadcrumb title="Sample Page" items={BCrumb} />

      <DataTableWithToolbar
        {...query}
        setQuery={setQuery}
        selectable
        selectorKey={"email"}
        rows={rows}
        rowsCount={100}
        pagination
        columns={[
          {
            key: "cname",
            name: "Name",
          },
          {
            key: "status",
            name: "status",
            type: "status",
          },
          ,
          {
            key: "more",
            name: "",
            type: "menu",
            menu: [
              {
                label: "Edit",
                icon: <IconEdit size={18} />,
                fn: (item, closeFn) => {},
              },
            ],
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
        renderAction={() => (
          <Tooltip title="Filter list">
            <IconButton>
              <IconFilter size="1.2rem" />
            </IconButton>
          </Tooltip>
        )}
        renderSelectAction={(selected) => (
          <Tooltip title="Delete">
            <IconButton>
              <IconTrash
                onClick={() => console.log("Delete", selected)}
                width="18"
              />
            </IconButton>
          </Tooltip>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;
