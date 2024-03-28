import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Media from "../add/Media";
import { uploadImage } from "../add/page";

const CourseMedia = ({ courseDetailsData, instructorData }) => {
  const [file, setFile] = useState(null);
  const handleFileUpload = async (event) => {
    setFile(event.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      courseOverviewProvider: "",
      videoUrl: "",
      thumbnail: null,
      instructor: 0,
      coInstructors: [],
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let imgRes = null;
        if (file) {
          imgRes = await uploadImage(file);
          if (!imgRes.id) {
            return showToast("Course thumbnail upload fail!");
          }
        }
        if (imgRes) {
          values["thumbnail"] = imgRes.id;
        } else {
          delete values.thumbnail;
        }
        const data = { ...values };
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
      } catch (error) {
        setSubmitting(false);
        showToast(error.message, "error");
      }
    },
  });

  useEffect(() => {
    if (courseDetailsData?.id) {
      formik.setValues({
        courseOverviewProvider: courseDetailsData.courseOverviewProvider,
        videoUrl: courseDetailsData.videoUrl,
        thumbnail: courseDetailsData.thumbnail,
        instructor: courseDetailsData.instructor.id,
        coInstructors: courseDetailsData.coInstructors?.map((item) => item.id),
      });
    }
  }, [courseDetailsData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Media
        formik={formik}
        file={file}
        handleFileUpload={handleFileUpload}
        instructorData={instructorData}
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

export default CourseMedia;
