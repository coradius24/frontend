import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import Info from "../add/Info";

export function arrayToObject(array) {
  return array.reduce((accumulator, currentObject) => {
    const key = Object.keys(currentObject)[0];
    const value = currentObject[key];
    accumulator[key] = value;
    return accumulator;
  }, {});
}

const CourseInfo = ({ courseDetailsData }) => {
  const formik = useFormik({
    initialValues: {
      outcomes: [{ value: "", id: `outcomes__${Date.now()}` }],
      whatsIn: [{ value: "", id: `whatsIn__${Date.now()}` }],
      requirements: [{ value: "", id: `requirements__${Date.now()}` }],
      faqs: [{ value: "", faq: "", id: `faq__${Date.now()}` }],
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = { ...values };
        data.requirements = values.requirements.map((item) => item.value);
        data.outcomes = values.outcomes.map((item) => item.value);
        data.whatsIn = values.whatsIn.map((item) => item.value);
        const formattedFaq = values.faqs.map((item) => {
          return {
            [item.faq]: item.value,
          };
        });
        data.faqs = arrayToObject(formattedFaq);
        if (formik.dirty) {
          const res = await courseService.updateCourse(
            courseDetailsData.id,
            data
          );
          setSubmitting(false);
          if (res.statusCode === 500) {
            showToast(res.message, "error");
          } else {
            queryClient.invalidateQueries(["adminCourseDetails"]);
            showToast("Successfully Updated!");
            formik.resetForm();
          }
        }
      } catch (error) {
        setSubmitting(false);
        showToast(error.message, "error");
      }
    },
  });

  useEffect(() => {
    if (courseDetailsData?.id) {
      formik.setValues({
        faqs: Object.keys(courseDetailsData.faqs).map((key, index) => ({
          value: courseDetailsData.faqs[key],
          faq: key,
          id: `faq__${Date.now()}__${index}`,
        })),
        requirements: courseDetailsData.requirements.map((item, index) => ({
          value: item,
          id: `requirements__${Date.now()}__${index}`,
        })),
        outcomes: courseDetailsData.outcomes.map((item, index) => ({
          value: item,
          id: `outcomes__${Date.now()}__${index}`,
        })),
        whatsIn: courseDetailsData.whatsIn
          ? courseDetailsData.whatsIn?.map((item, index) => ({
              value: item,
              id: `outcomes__${Date.now()}__${index}`,
            }))
          : [{ value: "", id: `whatsIn__${Date.now()}__${Math.random()}` }],
      });
    }
  }, [courseDetailsData]);

  const handleRemoveFaq = (index) => {
    const items = [...formik.values.faqs].filter((_, indx) => index !== indx);
    formik.setValues({
      ...formik.values,
      faqs: items,
    });
  };

  const handleRemoveArrayItems = (id, type) => {
    const items = [...formik.values[type]].filter((item) => item.id !== id);
    formik.setValues({
      ...formik.values,
      [type]: items,
    });
  };

  const handleArrayValueChange = (id, event) => {
    const values = [...formik.values[event.target.name]];
    const item = values.find((value) => value.id === id);
    item.value = event.target.value;
    formik.setValues({
      ...formik.values,
      [event.target.name]: values,
    });
  };

  // for dynamic faq
  const handleInputChange = (index, event) => {
    const values = [...formik.values.faqs];
    values[index][event.target.name] = event.target.value;
    formik.setValues({
      ...formik.values,
      faqs: values,
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Info
        formik={formik}
        handleInputChange={handleInputChange}
        handleRemoveFaq={handleRemoveFaq}
        handleArrayValueChange={handleArrayValueChange}
        handleRemoveArrayItems={handleRemoveArrayItems}
      />
      <Box maxWidth={"500px"} margin={"10px auto auto"} autoComplete="off">
        <Button
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

export default CourseInfo;
