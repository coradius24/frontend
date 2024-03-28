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
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const validationSchema = yup.object({
  photo: yup.mixed().required("Photo is required!"),
  caption: yup.string().nullable(),
});

const UploadPhotoModal = ({ id }) => {
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
      let formData = new FormData(); //formdata object
      setIsSubmitting(true);

      formData.append("photo", values.photo);
      formData.append("caption", values.caption);
      formData.append("albumId", id);
      galleryService
        .addPhoto(formData)
        .then((res) => {
          showToast("Photo added successfully!");
          queryClient.invalidateQueries(["singleAlbum"]);
          formik.resetForm();
          handleClose();
        })
        .catch((error) => {
          showToast("Failed to upload photo!", "error");
        })
        .finally(() => setIsSubmitting(false));
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("photo", file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    formik.setFieldValue("photo", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Button
        sx={{ width: "150px", marginRight: "10px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Upload Photo
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Photo upload</DialogTitle>
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
                <div className="upload-aria">
                  <div
                    className="drop-zone"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                  >
                    {formik.values.photo && (
                      <img
                        style={{
                          maxWidth: "220px",
                          borderRadius: "10px",
                        }}
                        className="preview-img"
                        src={URL.createObjectURL(formik.values.photo)}
                        alt="Selected Files"
                      />
                    )}

                    <Typography variant="h6">Photo</Typography>
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
              <Box
                sx={{
                  width: "460px",
                  maxWidth: "100%",
                }}
                mb={2}
              >
                <CustomFormLabel>Caption</CustomFormLabel>
                <CustomTextField
                  name="caption"
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  fullWidth
                />
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

export default UploadPhotoModal;
