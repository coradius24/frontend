import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import * as yup from "yup";

import AppTextEditor from "@/components/AppTextEditor";
import assignmentService from "@/services/assignmentService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

const validationSchema = yup.object({
  name: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
});

const AssignmentModal = ({ open, setOpen, children, assignmentId, data }) => {
  const params = useParams();
  const radioGroupRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      courseId: params.id,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = { ...values };
      if (assignmentId) {
        const res = await assignmentService.updateAssignment(assignmentId, {
          name: data.name,
          description: data.description,
          courseId: data.courseId,
        });
        setSubmitting(false);
        if (res.affected) {
          showToast("Successfully Updated!");
          formik.resetForm();
          queryClient.invalidateQueries(["adminAssignments"]);
          handleClose();
        } else {
          showToast(res.message, "error");
        }
      } else {
        const res = await assignmentService.createAssignment(data);
        setSubmitting(false);
        handleClose();
        if (res.raw) {
          showToast("Successfully Added!");
          queryClient.invalidateQueries(["adminAssignments"]);
        } else {
          showToast(res.message, "error");
        }
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  useEffect(() => {
    if (assignmentId && data) {
      const assignment = data.find(
        (item) => item.id === parseInt(assignmentId)
      );
      formik.setValues({ ...assignment });
    }
  }, [assignmentId, data]);
  return (
    <>
      {children}
      <Dialog
        TransitionProps={{ onEntering: handleEntering }}
        keepMounted
        maxWidth="sm"
        fullWidth
        open={open}
      >
        <DialogTitle>
          {assignmentId ? "Update Assignment" : "Add New Assignments"}
        </DialogTitle>
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
            <Box
              maxWidth={"500px"}
              margin={"0 auto"}
              noValidate
              mb={"20px"}
              autoComplete="off"
            >
              <Box mt={"-40px"}>
                <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="Assignment Name"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="description">
                  Description
                </CustomFormLabel>
                <AppTextEditor
                  inputLabel="Summary*"
                  value={formik.values.description}
                  onChange={(value) =>
                    formik.setFieldValue("description", value)
                  }
                  name="body"
                  height={150}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Box>

              <Button
                sx={{ mt: "10px" }}
                type="submit"
                fullWidth
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignmentModal;
