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
  import * as yup from "yup";
  import { IoMdAddCircle } from "react-icons/io";

  import { showToast } from "@/utils/lib";
  import CloseIcon from "@mui/icons-material/Close";
  import { useFormik } from "formik";
  import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import earningService from "@/services/earningService";
import { queryClient } from "@/utils/queryClient";
import React from "react";
import userService from "@/services/userService";
  
  const validationSchema = yup.object({
    password: yup.string().min(6).required("Password is Required"),
  });
  
  const ChangePasswordModal = ({ userId }) => {
    const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
    const formik = useFormik({
      initialValues: {
        password: "",
      },
      validationSchema,
      onSubmit: async (values) => {
        const res = await userService.changePasswordOfUser(userId, values.password);
        if (res?.statusCode === 400) {
          showToast(res.message, "error");
        } else {
          showToast("Successfully password changed!");
          setOpen(false);
          queryClient.invalidateQueries(["adminDailyReportOfAUser", userId])
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
        sx={{ width: "170px" }}
        variant="contained"
        color="info"
        onClick={handleClickOpen}
      >
        Change Password
      </Button>
        <Dialog maxWidth="sm" fullWidth open={open}>
          <DialogTitle>Change Password</DialogTitle>
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
                  <CustomFormLabel>Password</CustomFormLabel>
                  <CustomTextField
                       fullWidth
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                   />
                   {formik.errors.password && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.password}
                  </FormHelperText>
                )}
                </Box>
                <Stack mt={5} direction="row" justifyContent="flex-end">
                  <Button variant="contained" type="submit">
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
  
  export default ChangePasswordModal;
  