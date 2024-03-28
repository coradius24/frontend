import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import { TagsInput } from "react-tag-input-component";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

const CourseSeo = ({ courseDetailsData }) => {
  const formik = useFormik({
    initialValues: {
      metaKeywords: [],
      metaDescription: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const data = { ...values };
      const res = await courseService.updateCourse(courseDetailsData.id, data);
      setSubmitting(false);
      if (res.statusCode === 500) {
        showToast(res.message, "error");
      } else {
        queryClient.invalidateQueries(["adminCourseDetails"]);
        showToast("Successfully Updated!");
        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (courseDetailsData?.id) {
      formik.setValues({
        metaKeywords: courseDetailsData.metaKeywords || [],
        metaDescription: courseDetailsData.metaDescription,
      });
    }
  }, [courseDetailsData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        maxWidth={"500px"}
        margin={"0 auto"}
        noValidate
        mb={"20px"}
        autoComplete="off"
      >
        <Typography variant="h6" mb={1}>
          Meta Keywords
        </Typography>
        <TagsInput
          name="metaKeywords"
          value={formik.values.metaKeywords}
          onChange={(value) => (formik.values.metaKeywords = value)}
          placeHolder="Press Enter for adding tags"
        />
        <Box mt={"-10px"}>
          <CustomFormLabel htmlFor="metaDescription">
            Meta Description
          </CustomFormLabel>
          <CustomTextField
            id="metaDescription"
            multiline
            maxRows={4}
            name="metaDescription"
            value={formik.values.metaDescription}
            onChange={formik.handleChange}
            error={
              formik.touched.metaDescription &&
              Boolean(formik.errors.metaDescription)
            }
            helperText={
              formik.touched.metaDescription && formik.errors.metaDescription
            }
            placeholder="Meta Description"
            variant="outlined"
            fullWidth
          />
        </Box>

        <Button
          sx={{ mt: "10px" }}
          type="submit"
          fullWidth
          variant="contained"
          disabled={formik.isSubmitting}
        >
          UPDATE
        </Button>
      </Box>
    </form>
  );
};

export default CourseSeo;
