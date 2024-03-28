import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import * as yup from "yup";

import apiService from "@/services/api/apiService";
import courseService from "@/services/courseService";
import reviewService from "@/services/reviewService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { useLoading } from "@/utils/useCustomHook";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import ReviewAdd from "./ReviewAdd";
import ReviewEdit from "./ReviewEdit";
import ReviewView from "./ReviewView";

const validationSchema = yup.object({
  comment: yup.string().required("Comment is Required"),
});

const ReviewModal = ({
  open,
  setOpen,
  data,
  action,
  setAction,
  handleApprove,
}) => {
  const { startLoading, stopLoading, isLoading } = useLoading(false);
  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const handleClickOpen = () => {
    setAction("add");
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      comment: "",
      rating: 5,
      courseId: 0,
      userId: 0,
      reviewerName: "",
      status: "approved",
      reviewerPhoto: "",
      attachmentType: "image",
      videoThumbnail: "",
      attachment: "",
      reviewTye: "user",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (action === "edit" && data.id) {
          const update = { comment: values.comment, rating: values.rating };
          if (values.videoThumbnail) {
            update.videoThumbnail = values.videoThumbnail;
          }
          if (values.attachmentType === "image") {
            delete update.videoThumbnail;
          }
          try {
            const res = await reviewService.updateReviewByAdmin(data.id, {
              ...update,
            });
            setSubmitting(false);
            if (res?.statusCode === 500) {
              showToast(res.message, "error");
            } else {
              queryClient.invalidateQueries("adminReview");
              showToast("Reviews updated");
              formik.resetForm();
              setOpen(false);
            }
          } catch (error) {
            showToast(error.message, "error");
          }
        } else {
          try {
            startLoading();
            const formData = new FormData();
            const data = {
              ...values,
            };
            delete data.reviewTye;
            if (values.reviewTye === "user") {
              delete data.reviewerName;
              delete data.reviewerPhoto;
            } else {
              delete data.userId;
            }
            if (values.attachmentType === "image") {
              delete data.videoThumbnail;
            }
            for (const key in data) {
              formData.append(key, data[key]);
            }
            const config = {
              headers: { "content-type": "multipart/form-data" },
            };
            const res = await apiService.post("/api/reviews", formData, config);
            setSubmitting(false);
            if (res.id) {
              showToast("Successfully Added!");
              queryClient.invalidateQueries("adminReview");
              formik.resetForm();
              setOpen(false);
            } else {
              showToast(res.message, "error");
            }
          } catch (error) {
            setSubmitting(false);
            showToast(error.message, "error");
          } finally {
            setSubmitting(false);
            stopLoading();
          }
        }
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  useEffect(() => {
    if (data) {
      formik.setValues({
        ...data,
      });
    }
  }, [data]);

  let title = "Review";
  if (action === "edit") {
    title = "Update Review";
  } else if (action === "add") {
    title = "Add New Review";
  }
  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Create Review
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>{title}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            {action === "view" && data && (
              <ReviewView data={data} handleApprove={handleApprove} />
            )}
            {action === "edit" && data && <ReviewEdit formik={formik} />}
            {action === "add" && (
              <ReviewAdd
                formik={formik}
                courseNames={courseNames}
                isLoading={isLoading}
              />
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewModal;
