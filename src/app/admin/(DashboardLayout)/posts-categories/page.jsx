"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import blogService from "@/services/blogService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Typography } from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../AdminContext";
import CreateCategoryModal from "./CreateCategoryModal";
import "./page.css";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Blog Categories",
  },
];

const SamplePage = () => {
  const [edit, setEdit] = useQueryState("action");
  const [selected, setSelected] = useState(null);

  const { isFeatureAvailable } = useAdminContext();
  const [open, setOpen] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ["admin-blogs-categories"],
    queryFn: () => blogService.getCategories(),
    initialData: [],
  });

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setEdit(null);
    }
  }, [open]);

  useEffect(() => {
    if (selected && !edit) {
      setOpen(true);
      setEdit("edit");
    }
  }, [selected]);

  const handleDelete = (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete this!`,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !SweetAlert.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        blogService.deleteCategories(id).then((res) => {
          queryClient.invalidateQueries({
            queryKey: ["admin-blogs-categories"],
          });
          showToast("Delete Successfully!");
        });
      }
    });
  };

  return (
    <PageContainer title="Blogs Categories" description="this is Sample page">
      <Breadcrumb title="Blogs Categories" items={BCrumb} />
      <DataTableWithToolbar
        rows={data}
        isLoading={isPending}
        columns={[
          {
            key: "id",
            name: "ID",
          },
          {
            key: "name",
            name: "Title",
            template: (item) => (
              <div
                className="highlight-title"
                style={{ textTransform: "capitalize", color: item.colorCode }}
              >
                <span> {item.name}</span>
                <div
                  className="highlight"
                  style={{ background: item.colorCode }}
                ></div>
              </div>
            ),
          },
          {
            key: "colorCode",
            name: "Color Code",
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
                  closeFn();
                  setSelected(item);
                },
              },
              {
                label: "Delete",
                icon: <IconTrash size={18} />,
                fn: (item, closeFn) => {
                  closeFn();
                  handleDelete(item.id);
                },
              },
            ],
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">Blogs Posts</Typography>
        )}
        renderAction={() =>
          isFeatureAvailable("blog_category_create", "blogModule") ? (
            <CreateCategoryModal
              data={selected}
              edit={edit}
              open={open}
              setOpen={setOpen}
            />
          ) : null
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
