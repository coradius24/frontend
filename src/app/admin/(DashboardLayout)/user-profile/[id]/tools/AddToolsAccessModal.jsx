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
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import { IoMdAddCircle } from "react-icons/io";
import CustomAutoComplete from "../../../components/forms/theme-elements/CustomAutoComplete";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";

const validationSchema = yup.object({
  toolId: yup.string().required("User is Required"),
});

const AddToolsAccessModal = ({ userId }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["adminTools"],
    queryFn: () => toolsService.getAllToolsByAdmin({ limit: 100000, page: 1 }),
  });

  const formik = useFormik({
    initialValues: {
      toolId: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await toolsService.giveAccess({
        toolId: values.toolId,
        userId: Number(userId),
      });
      setSubmitting(false);
      if (res?.statusCode === 400) {
        showToast(res.message, "error");
      } else {
        queryClient.invalidateQueries(["adminToolsOfAUser", userId]);
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
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Add Tool Access
      </Button>
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
              <Stack mt={5} direction="row" justifyContent="flex-end">
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

export default AddToolsAccessModal;
