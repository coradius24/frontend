import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import * as yup from "yup";

import courseService from "@/services/courseService";
import toolsService from "@/services/toolsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import CustomAutoCompleteMultiSelect from "../components/forms/theme-elements/CustomAutoCompleteMultiSelect";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
import { uploadImage } from "../courses/add/page";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const validationSchema = yup.object({
  courseId: yup.string().required("Course Id Required"),
  toolId: yup.string().required("Tools Id Required"),
});

const ToolsBulkAccessModal = ({ open, setOpen }) => {
  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });
  const { isPending, error, data } = useQuery({
    queryKey: ["adminTools"],
    queryFn: () => toolsService.getAllToolsByAdmin({ limit: 100000, page: 1 }),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  

  const formik = useFormik({
    initialValues: {
      
      courseId: "",
      toolId: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {

        await toolsService.giveBulkAccess(values?.courseId, values?.toolId)
        showToast("Bulk access given");
        handleClose()
      } catch (error) {
        showToast(error.message, "error");
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };



  return (
    <>
      <Button
        sx={{ width: "300px" }}
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Give access to all Paid Student
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>Give Access to All Full Paid Students</DialogTitle>
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
            <Box mt="-40px" mb={1}>
                <CustomFormLabel>Select Tool</CustomFormLabel>
                <CustomAutoComplete
                  loading={isPending}
                  name="toolId"
                  placeholder={"Select Tool"}
                  value={formik.values.toolId}
                  onChange={formik.handleChange}
                  options={data?.results?.map((tool) => ({
                    label: tool.name,
                    value: tool.id,
                  }))}
                />
                {formik.errors.toolId && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.toolId}{" "}
                  </FormHelperText>
                )}
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
              <Stack mt={5} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ToolsBulkAccessModal;
