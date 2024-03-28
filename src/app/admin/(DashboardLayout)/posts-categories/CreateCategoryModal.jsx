"use client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";

import CustomFormLabel from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import blogService from "@/services/blogService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import * as yup from "yup";

const categoryValidationSchema = yup.object({
  name: yup.string().required("Name is Required"),
  colorCode: yup.string().required("Color is Required"),
});

const CreateCategoryModal = ({ open, setOpen, data, edit }) => {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      colorCode: "",
    },
    validationSchema: categoryValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      blogService
        .createCategories(values)
        .then((res) => {
          if (res.raw) {
            showToast("Successfully Created!");
            queryClient.invalidateQueries(["admin-blogs-categories"]);
            formik.resetForm();
          } else {
            showToast(`Fail, ${res.message}`, "error");
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data && edit) {
      formik.setValues({
        name: data.name,
        colorCode: data.colorCode,
      });
    } else {
      formik.resetForm();
    }
  }, [data, edit]);

  return (
    <>
      <Button
        sx={{ width: "250px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Add Category
      </Button>

      <Dialog open={open}>
        <DialogTitle>
          {data ? "Update Blog Category" : "New Blog Category"}
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
              sx={{
                width: "350px",
              }}
              mt={"-40px"}
            >
              <Box mt={"-20px"}>
                <CustomFormLabel htmlFor="name">Category Name</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="Category title"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={"-20px"}>
                <CustomFormLabel htmlFor="colorCode">
                  Category Color
                </CustomFormLabel>
                <CustomTextField
                  id="colorCode"
                  variant="outlined"
                  fullWidth
                  sx={{ width: 350 }}
                  type="color"
                  name="colorCode"
                  value={formik.values.colorCode}
                  onChange={formik.handleChange}
                />
              </Box>
            </Box>
            <Button
              sx={{ margin: "10px 0" }}
              fullWidth
              disabled={formik.isSubmitting}
              type="submit"
              variant="contained"
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCategoryModal;
