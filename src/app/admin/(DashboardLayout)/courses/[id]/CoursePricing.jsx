import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import Pricing from "../add/Pricing";

const CoursePricing = ({ courseDetailsData }) => {
  const formik = useFormik({
    initialValues: {
      isFeaturedCourse: false,
      isFreeCourse: false,
      price: 0,
      enableDripContent: true,
      allowPartialPaymentEnrollment: true,
      minimumPartialPayment: 0,
      allowWallet: true,
      allowSmartLinkGeneration: true,
      allowEarningReport: true,
      discountedPrice: 0,
      discountFlag: false,
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
        isFeaturedCourse: courseDetailsData.isFeaturedCourse,
        isFreeCourse: courseDetailsData.isFreeCourse,
        price: courseDetailsData.price,
        enableDripContent: courseDetailsData.enableDripContent,
        allowPartialPaymentEnrollment:
          courseDetailsData.allowPartialPaymentEnrollment,
        minimumPartialPayment: courseDetailsData.minimumPartialPayment,
        allowWallet: courseDetailsData.allowWallet,
        allowSmartLinkGeneration: courseDetailsData.allowSmartLinkGeneration,
        allowEarningReport: courseDetailsData.allowEarningReport,
        discountedPrice: courseDetailsData.discountedPrice,
        discountFlag: courseDetailsData.discountFlag,
      });
    }
  }, [courseDetailsData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Pricing formik={formik} />
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

export default CoursePricing;
