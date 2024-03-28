import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button } from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import Basic from "../add/Basic";

const validationSchema = yup.object({
  title: yup.string().required("Course title is required"),
  shortDescription: yup
    .string()
    .required("Course Short description is required"),
  categoryId: yup.string().required("Course Category is Required"),
});

const CourseBasic = ({ data, courseDetailsData }) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      shortDescription: "",
      categoryId: "",
      level: "",
      status: "",
      contentType: "",
      enrollmentDeadline: "",
      enableSupport: false,
      supportDepartment: "",
      enableDripContent: false,
      isTopCourse: false,
      isBatchCourse: false,
      parentCourseId: null,
      allowCertificate: false,
      minLessonCompletionRequiredForCertificate: 0,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = { ...values };
        if (!data.isBatchCourse) {
          data.parentCourseId = null;
        }
        delete data.isBatchCourse;

        if (!values.enableSupport) {
          delete data.supportDepartment;
        }
        if (values.enableSupport) {
          if (values.supportDepartment.length <= 0) {
            showToast("Please Select a Support Department!", "error");
            return;
          }
        }
        const res = await courseService.updateCourse(
          courseDetailsData.id,
          data
        );
        setSubmitting(false);
        if (res.statusCode === 500) {
          showToast(res.message, "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["adminCourseDetails"] });
          showToast("Successfully Updated!");
        }
      } catch (error) {
        setSubmitting(false);
        showToast(error.message, "error");
      }
    },
  });

  useEffect(() => {
    if (courseDetailsData?.id) {
      let liveCourseInfo = {};
      if (courseDetailsData.contentType === "live") {
        liveCourseInfo = {
          liveClassSchedule: courseDetailsData.liveClassSchedule,
          batchTitle: courseDetailsData.batchTitle,
          enrollmentDeadline: courseDetailsData.enrollmentDeadline,
        };
      }

      formik.setValues({
        title: courseDetailsData.title,
        shortDescription: courseDetailsData.shortDescription,
        categoryId: parseInt(courseDetailsData.categoryId),
        level: courseDetailsData.level,
        status: courseDetailsData.status,
        enableDripContent: courseDetailsData.enableDripContent,
        enableSupport: courseDetailsData.enableSupport || false,
        contentType: courseDetailsData.contentType,
        isTopCourse: courseDetailsData.isTopCourse,
        parentCourseId: courseDetailsData.parentCourseId,
        isBatchCourse: courseDetailsData.parentCourseId ? true : false,
        supportDepartment: courseDetailsData.supportDepartment || "",
        allowCertificate: courseDetailsData.allowCertificate,
        minLessonCompletionRequiredForCertificate:
          courseDetailsData.minLessonCompletionRequiredForCertificate,
        ...(courseDetailsData.contentType === "live" ? liveCourseInfo : {}),
      });
    }
  }, [courseDetailsData]);

  const handleDate = (value) => {
    formik.setValues({
      ...formik.values,
      enrollmentDeadline: dayjs(value).format("DD/MM/YYYY"),
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Basic formik={formik} data={data} handleDate={handleDate} />
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

export default CourseBasic;
