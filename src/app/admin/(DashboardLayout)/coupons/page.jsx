"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import couponService from "@/services/couponService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Chip, Typography } from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../AdminContext";
import CreateCouponModal from "./CreateCouponModal";
const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Coupons",
  },
];

const SamplePage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminCoupons", query],
    queryFn: () => couponService.getAllCoupons(query),
  });

  const handleDelete = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete this coupon!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await couponService.deleteCoupon(id);
          if (data?.statusCode === 400) {
            throw new Error("Something went wrong");
          }
          queryClient.invalidateQueries(["adminCoupons"]);
          showToast(`Successfully Delete!`);
        } catch (error) {
          showToast("Failed to Delete", "error");
        }
      }
    });
  };

  useEffect(() => {
    if (!open) {
      setSelected(null);
    }
  }, [open]);

  useEffect(() => {
    if (selected) {
      setOpen(true);
    }
  }, [selected]);

  return (
    <PageContainer title="Discount Coupons" description="this is Sample page">
      <Breadcrumb title="Coupons" items={BCrumb} />

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
            key: "code",
            name: "code",
          },
          {
            key: "discountAmount",
            name: "Discount Amount",
            template: (data) => (
              <Typography variant="h6">
                {data.discountAmount}{" "}
                {data?.discountType == "flat" ? "TK" : "%"}
              </Typography>
            ),
          },
          {
            key: "scope",
            name: "Scope",
            template: (data) => (
              <Typography>
                {" "}
                {data.scope != "allCourses" ? (
                  <>Course(IDs): {data.courseIds?.join(", ")}</>
                ) : (
                  <Chip variant="outlined" label="All Course" color="primary" />
                )}
              </Typography>
            ),
          },
          {
            key: "status",
            name: "Status",
            type: "status",
          },
          {
            key: "validity",
            name: "Validity",
            template: (data) => (
              <>
                <Typography>
                  {data?.startFrom && (
                    <>
                      <strong>From:</strong>{" "}
                      {moment(data?.startFrom).format("lll")}
                    </>
                  )}
                </Typography>
                <Typography>
                  {data?.expiry ? (
                    <>
                      <strong>To:</strong> {moment(data?.expiry).format("lll")}
                    </>
                  ) : (
                    " No Expiry"
                  )}
                </Typography>
              </>
            ),
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
                  setSelected(item);
                  closeFn();
                },
              },
              {
                label: "Delete",
                icon: <IconTrash size={18} />,
                fn: (item, closeFn) => {
                  handleDelete(item.id);
                  closeFn();
                },
              },
            ],
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">Available Coupons</Typography>
        )}
        renderAction={() =>
          isFeatureAvailable("create_coupon", "adminCouponModule") ? (
            <CreateCouponModal
              open={open}
              setOpen={setOpen}
              selected={selected}
              setSelected={setSelected}
            />
          ) : null
        }
      />
    </PageContainer>
  );
};

export default SamplePage;
