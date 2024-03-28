"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import useQueryParams from "@/hooks/useQueryParams";
import reviewService from "@/services/reviewService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";
import { MdFeaturedPlayList } from "react-icons/md";
import { useAdminContext } from "../../AdminContext";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import FilterPopover from "../components/shared/FilterPopover";
import ReviewModal from "./ReviewModal";
import Link from "next/link";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "Reviews",
  },
];

const SamplePage = () => {
  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(null);
  const [action, setAction] = useQueryState("action");

  const { isFeatureAvailable } = useAdminContext();
  const [query, setQuery] = useQueryParams({
    search: "",
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminReview", query],
    queryFn: () => reviewService.getReviewByAdmin(query),
  });

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setAction(null);
    }
  }, [open]);

  useEffect(() => {
    if (selected) {
      setOpen(true);
    }
  }, [selected]);

  const handleDelete = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete this review!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await reviewService.deleteReview(id);
          if (res?.raw) {
            queryClient.invalidateQueries(["adminReview"]);
            showToast(`Successfully Delete!`);
          } else {
            showToast(res.message, "error");
          }
        } catch (error) {
          showToast("Failed to delete", "error");
        }
      }
    });
  };

  const handleApprove = (id) => {
    setOpen(false);
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to Approved this review!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await reviewService.updateReviewByAdmin(id, {
            status: "approved",
          });
          if (res?.raw) {
            queryClient.invalidateQueries(["adminReview"]);
            showToast(`Successfully Approve!`);
          } else {
            showToast(res.message, "error");
          }
        } catch (error) {
          showToast("Failed to approve", "error");
        }
      }
    });
  };

  const handleFeatured = (id, isFeatured) => {
    setOpen(false);
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to ${
        isFeatured ? "remove" : "add"
      } featured this review!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await reviewService.updateReviewByAdmin(id, {
            isFeatured: !isFeatured,
          });
          if (res?.raw) {
            queryClient.invalidateQueries(["adminReview"]);
            showToast(`Successfully updated!`);
          } else {
            showToast(res.message, "error");
          }
        } catch (error) {
          showToast("Failed to updated", "error");
        }
      }
    });
  };

  return (
    <PageContainer title="Reviews" description="reviews">
      <Breadcrumb title="Reviews" items={BCrumb} />
      <DataTableWithToolbar
        {...query}
        setQuery={setQuery}
        rows={data?.results}
        rowsCount={data?.totalCount}
        pagination
        isLoading={isPending}
        columns={[
          {
            key: "reviewerName",
            name: "User",
            template: (data) => (
              data?.userId ?  
              <Stack component={Link} href={data?.userId ? `/admin/user-profile/${data?.userId}/wallet` : '#'} direction="row" spacing={2} alignItems={"center"}>
                <Avatar
                  src={data?.reviewerPhoto}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {data?.reviewerName}
                  </Typography>
                </Box>
              </Stack>
              :   <Stack  direction="row" spacing={2} alignItems={"center"}>
              <Avatar
                src={data?.reviewerPhoto}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {data?.reviewerName}
                </Typography>
              </Box>
            </Stack>
            ),
          },
          {
            key: "comment",
            name: "Review",
            template: (row) => (
              <Box>
                <Typography>
                  <strong>Course:</strong> {row.course?.title}{" "}
                  {row.course?.batchTitle}{" "}
                </Typography>
                <Comment row={row} />
              </Box>
            ),
          },
          {
            key: "status",
            name: "Status",
            type: "status",
          },
          {
            key: "isFeatured",
            name: "Is Featured",
            template: (row) => {
              const isFeatured = row?.isFeatured;
              return (
                <Box>
                  <Button
                    onClick={() => handleFeatured(row.id, Boolean(isFeatured))}
                    color={isFeatured ? "success" : "warning"}
                    variant="contained"
                  >
                    {isFeatured ? "Remove" : "Make Featured"}
                  </Button>
                </Box>
              );
            },
          },
          {
            key: "id",
            name: "Action",
            type: "menu",
            menu: [
              {
                label: "View",
                icon: <RemoveRedEyeIcon size={18} />,
                fn: (item, closeFn) => {
                  setAction("view");
                  setSelected(item);
                  setOpen(true);
                  closeFn();
                },
              },
              {
                label: "Edit",
                icon: <IconEdit size={18} />,
                fn: (item, closeFn) => {
                  setAction("edit");
                  setSelected(item);
                  setOpen(true);
                  closeFn();
                },
              },
              {
                label: "Make Featured Review",
                icon: <MdFeaturedPlayList size={18} />,
                fn: (item, closeFn) => {
                  setAction("edit");
                  setSelected(item);
                  setOpen(true);
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
          <Typography variant="h6"> Reviews ({data?.totalCount})</Typography>
        )}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            {isFeatureAvailable("update_review", "adminReviewModule") ? (
              <ReviewModal
                open={open}
                setOpen={setOpen}
                data={selected}
                action={action}
                handleApprove={handleApprove}
                setAction={setAction}
              />
            ) : null}
            <FilterPopover>
              <Box
                mt={"-10px"}
                mb={"15px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>Filter</Typography>
                <Typography
                  variant="button"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setQuery({
                      ...query,
                      courseId: "",
                    });
                  }}
                >
                  Clear
                </Typography>
              </Box>
              <Box mt="20px" mb={0} width={"250px"}>
                <CustomAutoComplete
                  name="courseId"
                  value={query.courseId}
                  onChange={({ target }) =>
                    setQuery({ ...query, courseId: target.value || "" })
                  }
                  options={courseNames?.map((course) => ({
                    label: `${course.title} ${course.batchTitle}`,
                    value: course.id,
                  }))}
                />
              </Box>
            </FilterPopover>
          </Stack>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;

const Comment = ({ row }) => {
  if (isTooltip(row.comment)) {
    return (
      <HtmlTooltip
        title={<Typography color="inherit">{row.comment}</Typography>}
      >
        <Typography sx={{ cursor: "pointer" }}>
          <strong>Review: </strong> {row.comment.slice(0, 25)}...
        </Typography>
      </HtmlTooltip>
    );
  }
  return (
    <Typography>
      <strong>Review: </strong>
      {row.comment}
    </Typography>
  );
};

const isTooltip = (comment = "") => {
  if (comment.length > 25) {
    return true;
  }
  return false;
};
