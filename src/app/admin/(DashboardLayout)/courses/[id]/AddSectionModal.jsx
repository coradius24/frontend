import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import * as yup from "yup";

import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
const validationSchema = yup.object({
  title: yup.string().required("Title is Required"),
});

const AddSectionModal = ({
  open,
  setOpen,
  children,
  sectionId,
  sectionsCurriculum,
}) => {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (sectionId) {
        const res = await courseService.updateSection(sectionId, {
          title: values.title,
          courseId: params.id,
        });
        if (res.affected) {
          queryClient.invalidateQueries("adminCourseModules");
          showToast("Section Updated!");
          setOpen(false);
        } else {
          showToast(res.message, "error");
        }
      } else {
        const res = await courseService.createSection({
          title: values.title,
          courseId: params.id,
        });
        if (res.raw) {
          queryClient.invalidateQueries("adminCourseModules");
          showToast("Section added!");
          setOpen(false);
        } else {
          showToast(res.message, "error");
        }
      }
    },
  });

  useEffect(() => {
    if (sectionId && sectionsCurriculum) {
      const data = sectionsCurriculum.find(
        (item) => item.id === parseInt(sectionId)
      );
      if (data) {
        formik.setValues({ title: data?.title });
        setOrder(data.order);
      }
    } else {
      setOrder(sectionsCurriculum?.length);
    }
  }, [sectionId]);

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  return (
    <>
      {children}
      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>
          {sectionId ? "Update Section" : "Create Section"}
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
            <Box>
              <CustomTextField
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                placeholder="Section Title"
                variant="outlined"
                fullWidth
              />
              <Box mt={2}>
                <CustomTextField
                  id="order"
                  name="order"
                  value={order}
                  onChange={({ target }) =>
                    setOrder(() => {
                      return target.value || 1;
                    })
                  }
                  placeholder="Section Order"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Stack mt={5} direction="row" justifyContent="flex-end">
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Stack>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSectionModal;
