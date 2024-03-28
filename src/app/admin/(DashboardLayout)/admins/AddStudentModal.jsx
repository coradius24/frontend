import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import * as yup from "yup";

import userService from "@/services/userService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import CustomCheckbox from "../components/forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const validationSchema = yup.object({
  fullName: yup.string().required("Name is Required"),
  email: yup.string().email().required("Email is Required"),
  phone: yup.string().required("Phone is Required"),
  password: yup.string().optional(),
});

const AddAdminModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      generatePassword: false,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
      if (!regex.test(values.phone)) {
        setSubmitting(false);
        return showToast("Invalid Mobile number!", "error");
      }
      userService
        .addUser({ ...values, role: 4 })
        .then((res) => {
          if (res?.statusCode != 400) {
            showToast("Admin added!");
            queryClient.invalidateQueries(["adminAdmins"]);
            handleClose();
            formik.resetForm();
          } else {
            showToast(res?.message || "Failed to add Admin!", "error");
          }
        })
        .catch(() => {
          showToast(res?.message || "Failed to add Admin!", "error");
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    if (formik.values.generatePassword) {
      formik.setFieldValue("password", Math.random().toString(36).slice(-8));
    } else {
      formik.setFieldValue("password", "");
    }
  }, [formik.values.generatePassword]);

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <>
      <Button
        sx={{ width: "150px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Add Admin
      </Button>

      <Dialog open={open}>
        <DialogTitle>Add Admin</DialogTitle>
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
              <Box sx={{ mt: -3 }}>
                <CustomFormLabel>Name *</CustomFormLabel>
                <CustomTextField
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Box>
              <Box>
                <CustomFormLabel>Email *</CustomFormLabel>
                <CustomTextField
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Box>
              <Box sx={{ mb: 2, width: "350px", maxWidth: "100%" }}>
                <CustomFormLabel>Mobile Number</CustomFormLabel>
                <CustomTextField
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Box>
              <Box sx={{ mb: 2, width: "350px", maxWidth: "100%" }}>
                <label>
                  <CustomCheckbox
                    color="primary"
                    name="generatePassword"
                    checked={formik.values.generatePassword}
                    onChange={formik.handleChange}
                    inputProps={{ "aria-label": "Generate password" }}
                  />
                  Generate password
                </label>
              </Box>

              {formik.values.generatePassword && (
                <>
                  <Box sx={{ mb: 2, mt: -2, width: "350px", maxWidth: "100%" }}>
                    <CustomFormLabel>Password</CustomFormLabel>
                    <CustomTextField
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Box>
                </>
              )}

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAdminModal;
