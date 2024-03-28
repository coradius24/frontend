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

const validationSchema = yup.object({
  clickCount: yup.string().required("User is Required"),
});

const AddExtraClicks = ({ shortUrlSlug, userId }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      clickCount: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await earningService.addExtraClicksToShortLink(
        shortUrlSlug,
        Number(values.clickCount)
      );
      setSubmitting(false);
      if (res?.statusCode === 400) {
        showToast(res.message, "error");
      } else {
        showToast("Successfully added extra clicks!");
        setOpen(false);
        queryClient.invalidateQueries(["adminDailyReportOfAUser", userId]);
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
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Add extra click
      </Button>
      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>Add extra click count and revenue</DialogTitle>
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
                <CustomFormLabel>Extra Click count</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  type="number"
                  name="clickCount"
                  value={formik.values.clickCount}
                  onChange={formik.handleChange}
                />
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

export default AddExtraClicks;
