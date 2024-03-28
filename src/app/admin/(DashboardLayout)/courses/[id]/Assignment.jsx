import { useAdminContext } from "@/app/admin/AdminContext";
import assignmentService from "@/services/assignmentService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import DataTableWithToolbar from "../../components/tables/DataTableWithToolbar";
import AssignmentModal from "./AssignmentModal";

const Assignment = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const [assignmentId, setAssignmentId] = useQueryState("id");
  const { isFeatureAvailable, features } = useAdminContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminAssignments", params.id],
    queryFn: () => assignmentService.getAssignmentsWithStatsForAdmin(params.id),
  });

  const handleModal = () => {
    setOpen(!open);
  };
  const handleEdit = (id) => {
    setAssignmentId(id);
  };

  useEffect(() => {
    if (assignmentId) {
      setOpen(true);
    }
  }, [assignmentId]);

  useEffect(() => {
    if (!open) {
      setAssignmentId(null);
    }
  }, [open]);

  const handleRoute = (id) => {
    router.push(`/admin/courses/assignment/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      SweetAlert.fire({
        title: "Are you sure?",
        text: `You want to delete this assignment!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await assignmentService.deleteAssignment(id);
            if (res.affected) {
              queryClient.invalidateQueries(["adminAssignments"]);
              showToast(`Successfully Delete!`);
            }
          } catch (error) {
            showToast("Failed to Delete", "error");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log("TableData", data)
  return (
    <>
      <DataTableWithToolbar
        selectorKey={"id"}
        rows={data}
        rowsCount={data?.length}
        // pagination
        isLoading={isPending}
        columns={[
          {
            key: "id",
            name: "ID",
          },
          {
            key: "name",
            name: "Name",
          },
          {
            key: "counts",
            name: "Counts",
            template: (row) => (<Stack spacing={3} direction="row">
              <Typography> Pending: <strong>{row?.pendingSubmissionCount || '0'}</strong>  </Typography>
              <Typography> Evaluated: <strong>{row?.evaluatedCount || '0'}</strong>   </Typography>
              <Typography> Rejected: <strong>{row?.askedForResubmissionCount || '0'}</strong>  </Typography>

            </Stack>)
          },
          {
            key: "createdAt",
            name: "Created Date",
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
                  handleEdit(item.id);
                  closeFn();
                },
                isAccessible: isFeatureAvailable("update_assignment", "adminAssignmentModule")
              },
              {
                label: "Assignment Submissions",
                icon: <RemoveRedEyeIcon size={18} />,
                fn: (item, closeFn) => {
                  handleRoute(item.id);
                },
                isAccessible: isFeatureAvailable("assignment_submissions_of_a_course", "adminAssignmentModule")

              },
              {
                label: "Delete",
                icon: <IconTrash size={18} />,
                fn: (item, closeFn) => {
                  handleDelete(item.id);
                  closeFn();
                },
                isAccessible: isFeatureAvailable("delete_assignment", "adminAssignmentModule")

              },
            ].filter(menu=>menu.isAccessible)
          },
        ]}
        renderLeftContent={() => (
          <Typography variant="h6">
            Assignments ({data?.length || 0})
          </Typography>
        )}
        renderAction={() => (
          <Stack spacing={1} direction="row">
            {isFeatureAvailable("create_assignment", "adminAssignmentModule") && (
              <AssignmentModal
                assignmentId={assignmentId}
                data={data}
                open={open}
                setOpen={setOpen}
              >
                <Tooltip title="Add New Course">
                  <Button
                    sx={{ width: "200px" }}
                    startIcon={<IoMdAddCircle />}
                    variant="outlined"
                    color="primary"
                    onClick={handleModal}
                  >
                    Add New Assignment
                  </Button>
                </Tooltip>
              </AssignmentModal>
            )}
          </Stack>
        )}
      />
    </>
  );
};

export default Assignment;
