import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import { IoMdAddCircle } from "react-icons/io";
import * as yup from "yup";

import earningService from "@/services/earningService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import React from "react";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import CustomAutoComplete from "../../../components/forms/theme-elements/CustomAutoComplete";
import courseService from "@/services/courseService";
import { useQuery } from "@tanstack/react-query";

const validationSchema = yup.object({
  courseId: yup.string().required("courseId is Required"),
});

const SmartLinkGeneration = ({ userId }) => {
  const [open, setOpen] = React.useState(false);
  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      courseId: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await earningService.generateSortLink(
        {
        userId: Number(userId),
        courseId: values?.courseId
      }
      );
      setSubmitting(false);
      if (res?.statusCode === 400) {
        showToast(res.message, "error");
      } else {
        showToast("Smart link generated!");
        setOpen(false);
        queryClient.invalidateQueries(["adminSmartLinksOfAUser", userId]);
        formik.resetForm();
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
        sx={{ width: "200px" }}
        // startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Generate Smartlink
      </Button>
      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>Generate Smartlink</DialogTitle>
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
              </Box>
              <Stack mt={5} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Generate
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartLinkGeneration;
