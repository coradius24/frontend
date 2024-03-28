import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import categoryService from "@/services/categoryService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import IconPicker from "./IconPicker";

const validationSchema = yup.object({
  name: yup.string().required("Category is Required"),
  colorCode: yup.string().required("Color Code is Required"),
});

const CourseCategoryModal = ({ isOpen, setIsOpen }) => {
  const [open, setOpen] = React.useState(() => isOpen);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen({ ...isOpen, open: false });
  };

  const [icon, setIcon] = useState(null);
  const handleOnChange = (e) => {
    setIcon(e);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      colorCode: "#fff",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const { type } = open;

      if (type === "add") {
        categoryService
          .createCategory({
            name: values.name,
            colorCode: values.colorCode,
            icon: icon.value,
            parent: 0,
          })
          .then(() => {
            showToast("Successfully Created!");
            setOpen(false);
            formik.resetForm();
            queryClient.invalidateQueries(["adminCourseCategories"]);
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else if (type === "edit") {
        categoryService
          .updateCategory(open.data.id, {
            name: values.name,
            colorCode: values.colorCode,
            icon: icon.value,
          })
          .then(() => {
            showToast("Successfully Updated!");
            formik.resetForm();
            setOpen(false);
            queryClient.invalidateQueries(["adminCourseCategories"]);
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else {
        categoryService
          .createCategory({
            name: values.name,
            colorCode: values.colorCode,
            icon: icon.value,
            parent: open.parent.id,
          })
          .then(() => {
            showToast("Successfully Added!");
            formik.resetForm();
            queryClient.invalidateQueries(["adminCourseCategories"]);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    },
  });

  useEffect(() => {
    if (isOpen.type === "edit") {
      formik.values.name = isOpen.data.name;
      formik.values.colorCode = isOpen.data.colorCode;
      setIcon({
        label: isOpen.data.icon,
        value: isOpen.data.icon,
      });
    } else if (isOpen.type === "sub") {
      formik.values.name = "";
    }
  }, [isOpen]);

  let modalTitle = "Create New Category";
  if (open.type == "edit") {
    modalTitle = "Update Category";
  } else if (open.type === "sub") {
    modalTitle = "Add New Sub Category";
  }

  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={() => setIsOpen({ open: true, type: "add" })}
      >
        Add New Categories
      </Button>

      <Dialog open={open.open} onClose={handleClose}>
        <DialogTitle>{modalTitle}</DialogTitle>
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
              <Box>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic"
                      label="Category"
                      variant="outlined"
                      fullWidth
                      sx={{ width: 350 }}
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mt={2} mb={4}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <IconPicker value={icon} onChangeHandler={handleOnChange} />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ zIndex: 0 }}>
                <Grid container spacing={1} mb={4}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic"
                      label="Color Code"
                      variant="outlined"
                      fullWidth
                      sx={{ width: 350 }}
                      type="color"
                      name="colorCode"
                      value={formik.values.colorCode}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Stack direction="row" justifyContent="flex-end">
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

export default CourseCategoryModal;
