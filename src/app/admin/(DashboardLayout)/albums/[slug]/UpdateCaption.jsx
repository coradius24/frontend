import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";

import galleryService from "@/services/galleryService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useEffect } from "react";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

const UpdateCaption = ({ isOpen, setIsOpen }) => {
  const formik = useFormik({
    initialValues: {
      caption: "",
    },
    onSubmit: async (values) => {
      const res = await galleryService.updateCaption(isOpen.data.id, {
        ...values,
      });

      if (res?.affected) {
        showToast("Successfully Updated");
        setIsOpen({
          ...isOpen,
          open: false,
        });
        queryClient.invalidateQueries(["singleAlbum"]);
      } else {
        showToast(res.message, "error");
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setIsOpen({
      ...isOpen,
      open: false,
    });
  };

  useEffect(() => {
    if (isOpen.open) {
      formik.setValues({ caption: isOpen.data.caption });
    }
  }, [isOpen]);

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={isOpen.open}>
        <DialogTitle>Update Caption</DialogTitle>
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
                <CustomFormLabel htmlFor="caption">Caption</CustomFormLabel>
                <CustomTextField
                  id="caption"
                  name="caption"
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.caption && Boolean(formik.errors.caption)
                  }
                  helperText={formik.touched.caption && formik.errors.caption}
                  placeholder="Caption"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Stack mt={5} direction="row" justifyContent="flex-end">
                <Button variant="contained" type="submit">
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

export default UpdateCaption;
