"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import blogService from "@/services/blogService";
import earningService from "@/services/earningService";
import { Typography } from "@mui/material";
import { IconEdit, IconEyeTable } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useAdminContext } from "../../AdminContext";
import CreateBlogDrawer from "./CreateBlogDrawer";

// import DashboardCard from "@/app/admin/(DashboardLayout)/components/shared/DashboardCard"
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Blogs",
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
    queryKey: ["admin-blogs", query],
    queryFn: () => blogService.getBlogs(query),
  });

  const handleApprove = async (id) => {
    await earningService.updatePayoutStatusByAdmin(id, {
      status: "paid",
    });
  };

  return (
    <PageContainer title="Blogs Posts" description="this is Sample page">
      <Breadcrumb title="Blogs" items={BCrumb} />
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
            key: "title",
            name: "Title",
            template: (data) => (
              <Typography variant="subtitle2">{data?.title}</Typography>
            ),
          },
          {
            key: "status",
            name: "Status",
            type: "status",
          },
          {
            key: "createdAt",
            name: "Created At",
            type: "datetime",
          },
          {
            key: "more",
            name: "Action",
            type: "menu",
            menu: [
              {
                label: "Edit",
                icon: <IconEdit size={18} />,
                fn: (item, closeFn) => {
                  console.log(item, closeFn);
                },
              },
              {
                label: "Make Unpublish",
                icon: <IconEyeTable size={18} />,
                fn: (item, closeFn) => {
                  console.log(item, closeFn);
                },
              },
            ],
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">Blogs Posts</Typography>
        )}
        renderAction={() =>
          isFeatureAvailable("blog_create", "blogModule") ? (
            <CreateBlogDrawer />
          ) : null
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
