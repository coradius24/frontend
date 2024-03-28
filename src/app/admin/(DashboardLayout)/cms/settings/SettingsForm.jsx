import React from "react";
import { Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { showToast } from "@/utils/lib";
import apiService from "@/services/api/apiService";
import courseService from "@/services/courseService";
import cmsService from "@/services/cmsService";

const validationSchema = yup.object({
  sendWelcomeSms: yup.boolean(),
});

const SettingsForm = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => cmsService.getPageContent("settings"),
    initialData: {},
  });


  const formik = useFormik({
    initialValues: {
      sendWelcomeSms: false,
      ...(data?.content || {})
    },
    enableReinitialize: true, 
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      cmsService.updatePageContent({
        id: "settings",
        content: values,
      })
        .then((res) => {

            showToast("Updated!");
            // formik.resetForm();
         
        })
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Send Welcome SMS"
          checked={formik.values.sendWelcomeSms}
          onChange={(e) => formik.setFieldValue('sendWelcomeSms', e.target.checked)}
        />
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default SettingsForm;
