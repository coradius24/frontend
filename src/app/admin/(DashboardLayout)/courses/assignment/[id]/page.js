"use client";
import { GetStatus } from "@/app/(student-portal)/dashboard/courses/[enroll]/Assignment";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import useQueryParams from "@/hooks/useQueryParams";
import assignmentService from "@/services/assignmentService";
import { getQueryString, showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BsCardChecklist } from "react-icons/bs";
import TopCards from "../../../components/course/TopCards";
import AssignmentView from "./AssignmentView";
const topCardData = [
  {
    icon: <BsCardChecklist size={35} />,
    title: "Total Assignment",
    digits: 0,
    bgColor: "primary",
    value: "totalCount",
  },
  {
    icon: <PendingActionsIcon size={35} />,
    title: "Pending Submission",
    digits: 0,
    bgColor: "primary",
    value: "pendingSubmissionCount",
  },
  {
    icon: <FactCheckIcon size={35} />,
    title: "Asked for re submit",
    digits: 0,
    bgColor: "primary",
    value: "askedForResubmissionCount",
  },
  {
    icon: <AssignmentIcon size={35} />,
    title: "Evaluated Count",
    digits: 0,
    bgColor: "primary",
    value: "evaluatedCount",
  },
];
const SamplePage = () => {
  const [open, setOpen] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const params = useParams();
  const [query, setQuery] = useQueryParams({
    status: "all",
    page: 1,
    limit: 10,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["adminSubmitAssignments", query],
    queryFn: () =>
      assignmentService.getSubmittedAssignments(
        params.id,
        getQueryString(query)
      ),
  });
  const cardData = topCardData.map((item) => {
    if (data) {
      item.digits = data[item.value] || 0;
    }
    return item;
  });

  const handleOpen = (item) => {
    setOpen(!open);
    setAssignment(item);
  };

  const handleReject = async (id) => {
    setOpen(false);
    const { value: text } = await SweetAlert.fire({
      input: "textarea",
      inputLabel: "Reason for reject!",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: "Yes, Reject!",
    });

    if (text) {
      const res = await assignmentService.assignmentEvaluation({
        submissionId: id,
        remarks: text,
        askForResubmit: true,
      });
      if (res.affected) {
        showToast("Updated");
      } else {
        showToast(`Fail, ${res.message}!`, "error");
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      setOpen(false);
      SweetAlert.fire({
        title: "Are you sure?",
        text: `You want to approve this assignment!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Approve!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await assignmentService.assignmentEvaluation({
              submissionId: id,
              askForResubmit: false,
            });
            if (res.affected) {
              queryClient.invalidateQueries(["adminSubmitAssignments"]);
              showToast(`Successfully Approve!`);
            }
          } catch (error) {
            showToast("Failed to approve", "error");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer title="Courses" description="this is Sample page">
      <Box mt={3} mb={3}>
        <Grid item xs={12} md="3" spacing={2}>
          <TopCards data={cardData} />
        </Grid>
      </Box>
      <AssignmentView
        open={open}
        handleReject={handleReject}
        handleApprove={handleApprove}
        setOpen={setOpen}
        data={assignment}
      />
      <DataTableWithToolbar
        selectorKey={"id"}
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
            name: "Name",
            template: (data) => (
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {data?.user?.fullName}
                  </Typography>
                </Box>
              </Stack>
            ),
          },
          {
            key: "status",
            name: "Status",
            template: (data) => <GetStatus status={data.status} />,
          },
          {
            key: "createdAt",
            name: "Submitted Time",
            type: "datetime",
          },
          {
            key: "action",
            name: "View",
            template: (data) => (
              <Button onClick={() => handleOpen(data)}>
                <RemoveRedEyeIcon />
              </Button>
            ),
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">Assignments ({data?.totalCount})</Typography>
        )}
      />
    </PageContainer>
  );
};

export default SamplePage;
