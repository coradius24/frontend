"use client";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import CustomSelect from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomSelect";

import CustomFormLabel from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel";
import CustomRadio from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomRadio";
import ParentCard from "@/app/admin/(DashboardLayout)/components/shared/ParentCard";
import apiService from "@/services/api/apiService";
import categoryService from "@/services/categoryService";
import courseService from "@/services/courseService";
import { SweetAlert } from "@/utils/sweet-alert";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { TagsInput } from "react-tag-input-component";
import Swal from "sweetalert2";
import * as yup from "yup";
import StudentSearchAutoCompleteMultiSelect from "../components/forms/StudentSearchAutoCompleteMultiSelect";
import CustomAutoCompleteMultiSelect from "../components/forms/theme-elements/CustomAutoCompleteMultiSelect";

const validationSchema = yup.object({
  receiverType: yup.string().required("Receiver Type is Required"),
  receivers: yup.mixed().nullable(),
  message: yup.string().required("message is Required"),
  thumbnailId: yup.number().nullable(),
});

const flatCategories = (_categories = []) => {
  const categories = [];
  _categories.forEach((cat) => {
    if (!cat?.subCategory?.length) {
      categories.push({
        groupBy: null,
        label: cat.name,
        value: cat.id,
      });
    } else {
      cat?.subCategory?.forEach((subCat) => {
        categories.push({
          groupBy: cat.name,
          label: subCat.name,
          value: subCat.id,
        });
      });
    }
  });

  return categories;
};

const notificationReceiverOptions = [
  {
    label: "Specific Courses",
    value: "specificCourses",
  },
  {
    label: "Batch Parent Course",
    value: "batchCourseParents",
  },
  {
    label: "Course Category",
    value: "courseCategories",
  },
  {
    label: "Full Paid in Specific Courses",
    value: "fullPaidCourses",
  },
  {
    label: "Having Dues in Specific Courses",
    value: "havingDuesOfSpecifCourses",
  },
  {
    label: "Individual Users",
    value: "individualUsers",
  },
  {
    label: "Phone Numbers",
    value: "phoneNumbers",
  },
  {
    label: "All",
    value: "all",
  },
];

export default function SmsForm() {
  const [receiverInputType, setReceiverInputType] = useState("tag");
  const formik = useFormik({
    initialValues: {
      receiverType: "specificCourses",
      receivers: [],
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      SweetAlert.fire({
        title: "Are you sure?",
        text: "You are sending SMS",
        showCancelButton: true,
        confirmButtonText: "Yes Send",
        showLoaderOnConfirm: true,
        icon: "warning",
        allowOutsideClick: () => !Swal.isLoading(),
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (receiverInputType === "bulkPaste") {
              values.receivers = values.receivers.split("\n");
            }
            const res = await apiService.post("/api/admin/sms", values);
            setSubmitting(false);
            if (res.success) {
              SweetAlert.fire({
                title: "SMS Submitted successfully!",
                icon: "success",
              });
              formik.resetForm();
            }
          } catch (error) {
            SweetAlert.fire({
              title: "Failed to submit SMS!",
              text: "Please check if SMS service has enough balance!",
              icon: "error",
            });
            setSubmitting(false);
          }
        } else {
          setSubmitting(false);
        }
      });
    },
  });

  const { data: smsBalance, isLoading: smsBalancePending } = useQuery({
    queryKey: ["adminSmsBalance"],
    queryFn: () => apiService.get("/api/admin/sms/balance"),
  });

  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: [
      "courseNames",
      formik.values.receiverType === "batchCourseParents",
    ],
    queryFn: () =>
      courseService.getCourseNames({
        isMainCourse: formik.values.receiverType === "batchCourseParents",
      }),
  });

  const { isPending: loadingCategories, data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCateGory(),
  });

  const { data: departments } = useQuery({
    queryKey: ["noticeDepartment"],
    queryFn: () => apiService.get("/api/admin/notices/departments"),
  });

  React.useEffect(() => {
    formik.setFieldValue("receivers", []);
  }, [formik.values?.receiverType]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ParentCard padding={"20px 40px"} title="SMS">
        <Stack
          sx={{
            mt: "-50px",
            justifyContent: "flex-end",
            textAlign: "right",
          }}
        >
          <Typography
            sx={{
              bg: "#f3fcf2",
              p: "8px 16px",
              borderRadius: "5px",
            }}
          >
            {!smsBalancePending && (
              <> Balance: {Number(smsBalance?.balance) || "..."} TK</>
            )}
          </Typography>
        </Stack>
        <Box sx={{ my: 2 }}>
          <CustomFormLabel htmlFor="name">Message</CustomFormLabel>
          <textarea
            style={{
              width: "100%",
              display: "block",
              border: "1px solid #99999980",
              borderRadius: 8,
              padding: "10px",
            }}
            fullWidth
            rows={10}
            value={formik.values.message}
            onChange={formik.handleChange}
            name="message"
          />
          <small>
            Character count: {formik.values.message?.length} , SMS :{" "}
            {Math.ceil(formik.values?.message?.length / 160) ||
              (formik.values?.message?.length ? 1 : 0)}
          </small>
          {formik.touched.message && Boolean(formik.errors.message) && (
            <p style={{ color: "red" }}>Message is required</p>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="demo-simple-select">
              Receiver Group
            </CustomFormLabel>
            <CustomSelect
              labelId="receiverType-select-label"
              id="receiverType-select"
              name="receiverType"
              value={formik.values.receiverType}
              onChange={formik.handleChange}
              fullWidth
              error={
                formik.values.receiverType &&
                Boolean(formik.errors.receiverType)
              }
              helperText={
                formik.touched.receiverType && formik.errors.receiverType
              }
            >
              {notificationReceiverOptions?.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          {formik.values.receiverType &&
            formik.values.receiverType != "all" && (
              <Grid item xs={12} sm={12} lg={12} mt={0}>
                <CustomFormLabel htmlFor="cname">Receivers</CustomFormLabel>

                {formik.values.receiverType === "individualUsers" ? (
                  <StudentSearchAutoCompleteMultiSelect
                    value={formik.values.receivers}
                    onChange={formik.handleChange}
                    name="receivers"
                    placeholder="Search User by Name/email/id"
                  />
                ) : (
                  <>
                    {formik.values.receiverType === "courseCategories" ? (
                      <>
                        <CustomAutoCompleteMultiSelect
                          // loading={loadingCourseNames}
                          name="receivers"
                          value={formik.values.receivers}
                          onChange={formik.handleChange}
                          groupBy={(option) => {
                            return (
                              flatCategories(categories)?.find(
                                (cat) => cat.value == option
                              )?.groupBy || "Others"
                            );
                          }}
                          options={flatCategories(categories) || []}
                        />
                      </>
                    ) : formik.values.receiverType === "phoneNumbers" ? (
                      <>
                        <Grid item xs={12} sm={12}>
                          <CustomFormLabel>Numbers Type</CustomFormLabel>
                          <RadioGroup
                            onChange={({ target }) => {
                              setReceiverInputType(target.value);
                            }}
                            defaultValue="tag"
                            value={receiverInputType}
                            name="radio-buttons-group"
                          >
                            <Grid container>
                              <Grid item xs={12} sm={2}>
                                <FormControl component="fieldset">
                                  <FormControlLabel
                                    value="tag"
                                    control={<CustomRadio />}
                                    label="Insert by one(TAG)"
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={4} lg={6}>
                                <FormControl component="fieldset">
                                  <FormControlLabel
                                    value="bulkPaste"
                                    control={<CustomRadio />}
                                    label="Bulk Paste"
                                  />
                                </FormControl>
                              </Grid>
                            </Grid>
                          </RadioGroup>
                        </Grid>
                        {receiverInputType === "bulkPaste" ? (
                          <>
                            <textarea
                              style={{
                                width: "100%",
                                display: "block",
                                border: "1px solid #99999980",
                                borderRadius: 8,
                                padding: "10px",
                              }}
                              fullWidth
                              rows={10}
                              value={formik.values.receivers}
                              onChange={formik.handleChange}
                              name="receivers"
                              placeholder="Bulk paste"
                            />
                          </>
                        ) : (
                          <>
                          <TagsInput
                            style={{ padding: "15px", height: "55px" }}
                            value={formik.values.receivers || []}
                            onChange={(value) =>
                              formik.setFieldValue("receivers", value || [])
                            }
                            name="receivers"
                            placeHolder="Enter phone Numbers"
                          />
                          <small>Selected Phone Numbers <strong>{formik.values.receivers?.length || '0'}</strong>  | Press Enter after each phone number to complete the entry. </small>
                          </>
                        )}
                      </>
                    ) : (
                      <CustomAutoCompleteMultiSelect
                        loading={loadingCourseNames}
                        name="receivers"
                        value={formik.values.receivers}
                        onChange={formik.handleChange}
                        options={courseNames?.map((course) => ({
                          label: `${course.title} ${course.batchTitle}`,
                          value: course.id,
                        }))}
                      />
                    )}
                  </>
                )}
              </Grid>
            )}

          <Grid item xs={12} sm={12} lg={12}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="end"
              mt={2}
            >
              <Stack direction="row" spacing={1}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting || (formik.values.receivers?.length === 0 && formik.values.receiverType === "phoneNumbers" && receiverInputType !== "bulkPaste" )}
                  
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </form>
  );
}
