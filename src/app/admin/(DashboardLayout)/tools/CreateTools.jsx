import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import * as yup from "yup";

import courseService from "@/services/courseService";
import toolsService from "@/services/toolsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import CustomAutoCompleteMultiSelect from "../components/forms/theme-elements/CustomAutoCompleteMultiSelect";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
import { uploadImage } from "../courses/add/page";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const validationSchema = yup.object({
  name: yup.string().required("Tools name is Required"),
  link: yup.string().required("Tools links is Required"),
  type: yup.string().required("Tools type is Required"),
  ownershipType: yup.string().required("Ownership Type is Required"),
});

const CreateTools = ({ open, setOpen, data, editId }) => {
  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [file, setFile] = React.useState(null);

  const handleFileUpload = async (event) => {
    setFile(event.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      ownershipType: "common",
      link: "",
      courseId: [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let imgRes = null;
        if (file) {
          imgRes = await uploadImage(file);
          if (!imgRes.id) {
            setSubmitting(false);
            return showToast("Tools image upload fail!");
          }
        }
        if (imgRes) {
          values["thumbnailId"] = imgRes.id;
        }
        if (!editId) {
          try {
            const res = await toolsService.addNewTool({
              ...values,
            });
            setSubmitting(false);
            if (res.statusCode === 500) {
              showToast(res.message, "error");
            } else {
              queryClient.invalidateQueries("adminTools");
              showToast("Tools Created!");
              formik.resetForm();
              setOpen(false);
            }
          } catch (error) {
            showToast(error.message, "error");
          }
        } else {
          try {
            const res = await toolsService.updateTool(editId, {
              ...values,
            });
            setSubmitting(false);
            if (res.statusCode === 500) {
              showToast(res.message, "error");
            } else {
              queryClient.invalidateQueries("adminTools");
              showToast("Updated!");
              formik.resetForm();
              setOpen(false);
            }
          } catch (error) {
            setSubmitting(false);
            showToast(error.message, "error");
          }
        }
      } catch (error) {
        showToast(error.message, "error");
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  useEffect(() => {
    if (data && editId) {
      formik.setValues({
        ...data,
        courseId: data.courseId.map((item) => parseInt(item)),
      });
    }
  }, [data, editId]);

  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Create Tools
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>Create Tools</DialogTitle>
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
                <CustomFormLabel htmlFor="name">Tools Name</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="Tools Name"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="file">Upload Image</CustomFormLabel>
                <Typography mt={"-2px"}>
                  <Button
                    component="label"
                    variant="contained"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Thumbnail Image
                    <VisuallyHiddenInput
                      type="file"
                      id="file"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Typography>
              </Box>
              <Box mt="-10px">
                <CustomFormLabel htmlFor="type">Link Type</CustomFormLabel>
                <CustomAutoComplete
                  name="type"
                  id="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  options={[
                    {
                      name: "External Link",
                      value: "externalLink",
                    },
                    {
                      name: "Copy Able Link",
                      value: "copyableLink",
                    },
                  ].map((option) => ({
                    label: `${option.name}`,
                    value: option.value,
                  }))}
                />
                {formik.errors.type && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.type}{" "}
                  </FormHelperText>
                )}
              </Box>
              <Box mt="-10px">
                <CustomFormLabel htmlFor="ownershipType">
                  Ownership Type
                </CustomFormLabel>
                <CustomAutoComplete
                  name="ownershipType"
                  id="ownershipType"
                  value={formik.values.ownershipType}
                  onChange={formik.handleChange}
                  options={[
                    {
                      name: "Common",
                      value: "common",
                    },
                    {
                      name: "Personal",
                      value: "personal",
                    },
                  ].map((option) => ({
                    label: `${option.name}`,
                    value: option.value,
                  }))}
                />
                {formik.errors.ownershipType && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.ownershipType}{" "}
                  </FormHelperText>
                )}
              </Box>
              <Box mt={"-10"}>
                <CustomFormLabel htmlFor="link">Link</CustomFormLabel>
                <CustomTextField
                  id="link"
                  name="link"
                  value={formik.values.link}
                  onChange={formik.handleChange}
                  error={formik.touched.link && Boolean(formik.errors.link)}
                  helperText={formik.touched.link && formik.errors.link}
                  placeholder="Link"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={"-10"}>
                <CustomFormLabel htmlFor="courseId">Courses </CustomFormLabel>
                <CustomAutoCompleteMultiSelect
                  id="courseId"
                  name="courseId"
                  value={formik.values.courseId}
                  onChange={formik.handleChange}
                  options={courseNames?.map((option) => ({
                    label: `${option.title} ${option.batchTitle}`,
                    value: option.id,
                  }))}
                />
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
export default CreateTools;
