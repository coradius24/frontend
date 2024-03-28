import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import * as yup from "yup";

import courseService from "@/services/courseService";
import enrollmentService from "@/services/enrollmentService";
import { showToast } from "@/utils/lib";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { FiFolderPlus } from "react-icons/fi";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
import { queryClient } from "@/utils/queryClient";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const CreateBulkEnrollmentModal = () => {
  const validationSchema = yup.object({
    courseId: yup.string().required("Course is Required"),
  });

  const [open, setOpen] = React.useState(false);

  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [file, setFile] = useState(null);
  const handleFileUpload = async (event) => {
    setFile(event.target.files[0]);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      courseId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.set("file", file);
      enrollmentService
      .bulkEnroll({
        courseId: values.courseId,
        formData,
      })
      .then((res) => {
        if (res) {
          showToast("Request Submitted for processing!");
    
          const rejectedEnrollments = res.filter(enrollment => enrollment.status === 'rejected');
    
          const csvData = rejectedEnrollments.map(enrollment => ({
            email: enrollment.reason.email,
            reason: enrollment.reason.reason,
            mobileNumber: enrollment.reason.mobileNumber,
          }));
    
          const csvContent = "data:text/csv;charset=utf-8," +
            csvData.map(row => Object.values(row).join(',')).join('\n');
    
          const encodedUri = encodeURI(csvContent);
    
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `enroll-failed-emails-${getCurrentTime()}.csv`);
          document.body.appendChild(link);
    
          link.click(); // This will trigger the download
    
          function getCurrentTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
    
            return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
          }
    
          setFile(null);
          formik.resetForm();
          handleClose();
        } else {
          showToast(res?.message || "Fail!", "error");
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the bulk enrollment
        console.error("Error during bulk enrollment:", error);
        showToast("An error occurred during enrollment.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
        queryClient.invalidateQueries(['adminEnrollments']);
      });
    
    },
  });

  return (
    <>
      <Button
        sx={{ width: "130px" }}
        startIcon={<FiFolderPlus />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Bulk Enroll
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <DialogTitle> Bulk Enroll from excel</DialogTitle>
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
            <Stack>
              <Box mt={"-30px"}>
                <CustomFormLabel>Upload excel file</CustomFormLabel>
                <CustomTextField
                  onChange={handleFileUpload}
                  type="file"
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <CustomFormLabel>Select Course</CustomFormLabel>
                <CustomAutoComplete
                  name="courseId"
                  value={formik.values.courseId}
                  onChange={formik.handleChange}
                  options={courseNames?.map((course) => ({
                    label: `${course.title} ${course.batchTitle}`,
                    value: course.id,
                  }))}
                />
                {formik.errors.courseId && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.userId}{" "}
                  </FormHelperText>
                )}
              </Box>

              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                }}
                spacing={3}
                justifyContent="flex-end"
              >
                <a target="_black" href="/admin/enrollment-template.xlsx">
                  Sample Excel template
                </a>
                <Button
                  disabled={isSubmitting || !file || !formik.values.courseId}
                  variant="contained"
                  type="submit"
                >
                  {isSubmitting ? "Processing" : "Submit"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateBulkEnrollmentModal;
