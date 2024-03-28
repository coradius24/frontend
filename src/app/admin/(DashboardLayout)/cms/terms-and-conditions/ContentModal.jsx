import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import * as yup from "yup";

import AppTextEditor from "@/components/AppTextEditor";
import cmsService from "@/services/cmsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";

const validationSchema = yup.object({
  title: yup.string().required("Title is Required"),
  subtitle: yup.string().required("Sub title is Required"),
});

const ContentModal = () => {
  const [open, setOpen] = React.useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["terms-and-conditions"],
    queryFn: () => cmsService.getPageContent("terms-and-conditions"),
    initialData: {},
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      cmsService
        .updatePageContent({
          id: "terms-and-conditions",
          content: values,
        })
        .then((res) => {
          if (res.id) {
            showToast("Updated");
            queryClient.invalidateQueries({ queryKey: ["terms-and-conditions"] });
            handleClose();
          } else {
            showToast(res.message, "error");
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    if (data.id) {
      formik.setValues({
        ...data.content,
      });
    }
  }, [data.id]);

  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Update Content
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle> Update Content</DialogTitle>
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
              <Box mt={"-40px"}>
                <CustomFormLabel htmlFor="title">Page Title</CustomFormLabel>
                <TextField
                  id="title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="subtitle">
                  Page Subtitle
                </CustomFormLabel>
                <TextField
                  id="subtitle"
                  variant="outlined"
                  fullWidth
                  name="subtitle"
                  value={formik.values.subtitle}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="content">
                  Page Content
                </CustomFormLabel>
                <AppTextEditor
                  inputLabel="content*"
                  value={formik.values.content}
                  onChange={(value) => formik.setFieldValue("content", value)}
                  name="body"
                  height={200}
                />
              </Box>
              <Stack mt={2} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={formik.isSubmitting}
                >
                  Update
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentModal;
