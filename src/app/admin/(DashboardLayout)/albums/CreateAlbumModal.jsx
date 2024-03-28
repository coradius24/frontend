import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import * as yup from "yup";

import galleryService from "@/services/galleryService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const validationSchema = yup.object({
  name: yup.string().required("Album name is required!"),
  shortDescription: yup.string().nullable(),
});

const CreateAlbumModal = () => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      shortDescription: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (isSubmitting) return;
      let formData = new FormData();
      setIsSubmitting(true);

      formData.append("thumbnail", values.thumbnail);
      formData.append("name", values.name);
      formData.append("shortDescription", values.shortDescription);
      galleryService
        .createAlbum(formData)
        .then((res) => {
          showToast("Album created successfully!");
          queryClient.invalidateQueries(["albums"]);
          formik.resetForm();
          handleClose();
        })
        .catch((error) => {
          showToast("Failed to create album!", "error");
        })
        .finally(() => setIsSubmitting(false));
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("thumbnail", file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    formik.setFieldValue("thumbnail", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
        Create Album
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Album</DialogTitle>
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
              <Box
                mt={"-40px"}
                sx={{
                  width: "460px",
                  maxWidth: "100%",
                }}
              >
                <CustomFormLabel>Name</CustomFormLabel>
                <CustomTextField
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <CustomFormLabel>Short description</CustomFormLabel>
                <CustomTextField
                  name="shortDescription"
                  value={formik.values.shortDescription}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Box>
              <Box mb={3}>
                <div className="upload-aria">
                  <div
                    className="drop-zone"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                  >
                    {formik.values.thumbnail && (
                      <img
                        style={{
                          maxWidth: "220px",
                          borderRadius: "10px",
                        }}
                        className="preview-img"
                        src={URL.createObjectURL(formik.values.thumbnail)}
                        alt="Selected Files"
                      />
                    )}

                    <Typography variant="h6">Thumbnail</Typography>
                    <p>
                      Drag and drop file <br />
                    </p>
                  </div>

                  <input
                    style={{ display: "none" }}
                    id="file-upload"
                    accept="image/*"
                    type="file"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload">
                    <span> Browse files</span>
                  </label>
                </div>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  type="submit"
                >
                  {isSubmitting ? "Saving.." : "Save"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAlbumModal;
