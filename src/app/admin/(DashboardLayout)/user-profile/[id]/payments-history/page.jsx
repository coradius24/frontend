"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import useQueryParams from "@/hooks/useQueryParams";
import paymentService from "@/services/paymentService";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import useApp from "@/hooks/useApp";
import { MdDelete } from "react-icons/md";

const SamplePage = ({ params }) => {
  const { user } = useApp();

  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminPaymentsOfAUser", params.id, query],
    queryFn: () => paymentService.paymentHistoryByUserId(params.id, query),
  });
  const handleDelete = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete this payment history!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = await paymentService.removePayment(id)
          if (data.statusCode === 400) {
            throw new Error("Something went wrong");
          }
          queryClient.invalidateQueries(["adminPaymentsOfAUser"]);
          showToast(`Successfully Delete!`);
        } catch (error) {
          showToast("Failed to update", "error");
        }
      }
    });
  };

  return (
    <PageContainer title="Course Enrollments" description="this is Sample page">
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
            key: "courseTitle",
            name: "Course",
            template: (data) => (
              <Box>
                <Typography color="textSecondary" variant="subtitle2">
                  {data?.course?.title}
                </Typography>
                <Typography variant="subtitle3" fontWeight="600">
                  Batch: {data?.course?.batchTitle || "Main"}
                </Typography>
              </Box>
            ),
          },
          {
            key: "paymentMethod",
            name: "Payment Method",
          },
          {
            key: "amount",
            name: "Paid Amount",
            template : (data) => <>
            <Typography>{data?.amount || "0"} TK</Typography>
            {data?.manuallyInsertedBy && <Link href={`/admin/user-profile/${data?.manuallyInsertedBy}/profile`}
              >
               Entry By #{data?.manuallyInsertedBy}
              </Link>}
            
            </>
          },
          {
            key: "due",
            name: "Due",
            type: "bdt",
          },

          {
            key: "discount",
            name: "Discount",
            template: (data) => (
              <Stack direction="column">
                <Typography variant="subtitle2">
                  {data?.discountAmount || 0} TK
                </Typography>
                {data?.couponApplied && (
                  <small>{data?.couponApplied}</small>
                )}
              </Stack>
            ),
          },

          {
            key: "paymentStage",
            name: "Status",
            type: "status",
          },

          {
            key: "createdAt",
            name: "Date",
            type: "datetime",
          },
          {
            key: "delete",
            name: "",
            template: (item) => user?.role === 5 && item?.isLatestPaymentForTheCourse && <>
             <IconButton 
                    color="error"
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                  >
                    <MdDelete />
              </IconButton>
            </>,
          },
        ]}
        renderLeftContent={() => <Typography variant="h6">Payments</Typography>}
      />
    </PageContainer>
  );
};

export default SamplePage;
