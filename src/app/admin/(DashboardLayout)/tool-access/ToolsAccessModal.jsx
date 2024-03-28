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

import toolsService from "@/services/toolsService";
import { showToast } from "@/utils/lib";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import StudentSearchAutoComplete from "../components/forms/StudentSearchAutoComplete";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";

const validationSchema = yup.object({
  userId: yup.string().required("User is Required"),
});

const ToolsAccessModal = ({ open, setOpen, editId }) => {
  const formik = useFormik({
    initialValues: {
      userId: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await toolsService.giveAccess({
        userId: values.userId,
        toolId: editId,
      });
      setSubmitting(false);
      if (res?.statusCode === 400) {
        showToast(res.message, "error");
      } else {
        showToast("Successfully Add Access!");
        setOpen(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>Give Access</DialogTitle>
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
                <CustomFormLabel>Select User</CustomFormLabel>
                <StudentSearchAutoComplete
                  name="userId"
                  value={formik.values.userId}
                  onChange={formik.handleChange}
                />
                {formik.errors.userId && (
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

export default ToolsAccessModal;
