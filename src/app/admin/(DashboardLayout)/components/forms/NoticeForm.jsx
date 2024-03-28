"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import CustomTextField from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

import CustomSelect from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomSelect";

import CustomFormLabel from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel";
import CustomRadio from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomRadio";
import AppTextEditor from "@/components/AppTextEditor";
import apiService from "@/services/api/apiService";
import categoryService from "@/services/categoryService";
import courseService from "@/services/courseService";
import noticeboardService from "@/services/noticeboardService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import ParentCard from "../shared/ParentCard";
import StudentSearchAutoCompleteMultiSelect from "./StudentSearchAutoCompleteMultiSelect";
import CustomAutoCompleteMultiSelect from "./theme-elements/CustomAutoCompleteMultiSelect";

const validationSchema = yup.object({
  receiverType: yup.string().required("Receiver Type is Required"),
  receivers: yup.array().nullable(),
  title: yup.string().required("Title is Required"),
  body: yup.string().required("Body is Required"),
  scheduled: yup.date().nullable(),
  thumbnailId: yup.number().nullable(),
  departmentId: yup.number().nullable(),
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
    label: "All",
    value: "all",
  },
  {
    label: "Individual Users",
    value: "individualUsers",
  },
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
];

export default function NoticeForm({ handleSubmit }) {
  const formik = useFormik({
    initialValues: {
      receiverType: "all",
      receivers: [],
      title: "",
      body: "",
      scheduled: null,
      departmentId: null,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values);
      setSubmitting(false);
    },
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

  // /api/notices/departments
  const [deliveryOption, setDeliveryOption] = React.useState("instant");

  React.useEffect(() => {
    formik.setFieldValue("receivers", []);
  }, [formik.values?.receiverType]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ParentCard padding={"20px 40px"} title="Notice">
        <Box>
          <CustomFormLabel htmlFor="name">Title</CustomFormLabel>
          <CustomTextField
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            placeholder="Enter text"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <CustomFormLabel htmlFor="name">Description</CustomFormLabel>
          <AppTextEditor
            inputLabel="Article*"
            value={formik.values.body}
            onChange={(value) => formik.setFieldValue("body", value)}
            name="body"
            height={450}
            error={formik.touched.body && Boolean(formik.errors.body)}
            helperText={formik.touched.body && formik.errors.body}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} lg={deliveryOption === "schedule" ? 4 : 6}>
            <CustomFormLabel>Delivery</CustomFormLabel>
            <RadioGroup
              onChange={({ target }) => {
                setDeliveryOption(target.value);
              }}
              defaultValue="instant"
              name="radio-buttons-group"
            >
              <Grid container>
                <Grid item xs={12} sm={4} lg={6}>
                  <FormControl component="fieldset">
                    <FormControlLabel
                      value="instant"
                      control={<CustomRadio />}
                      label="Instant"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} lg={6}>
                  <FormControl component="fieldset">
                    <FormControlLabel
                      value="schedule"
                      control={<CustomRadio />}
                      label="schedule"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </RadioGroup>
          </Grid>
          {deliveryOption === "schedule" && (
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="date">Schedule for</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  fullWidth
                  renderInput={(props) => (
                    <CustomTextField
                      {...props}
                      fullWidth
                      // name="scheduled"
                      sx={{
                        "& .MuiSvgIcon-root": {
                          width: 18,
                          height: 18,
                        },
                        "& .MuiFormHelperText-root": {
                          display: "none",
                        },
                      }}
                    />
                  )}
                  name="scheduled"
                  value={formik.values.scheduled}
                  onChange={(dateData) => {
                    formik.setFieldValue("scheduled", dateData);
                  }}
                />
              </LocalizationProvider>
            </Grid>
          )}

          <Grid item xs={12} sm={12} lg={deliveryOption === "schedule" ? 4 : 6}>
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
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
              direction="row"
            >
              <CustomFormLabel htmlFor="demo-simple-select">
                Department
              </CustomFormLabel>
              <CreateDepartmentModal />
            </Stack>
            <CustomSelect
              labelId="receiverType-select-label"
              id="receiverType-select"
              name="departmentId"
              value={formik.values.departmentId}
              onChange={formik.handleChange}
              fullWidth
            >
              <MenuItem value={null}>None</MenuItem>
              {departments?.results?.map((option) => (
                <MenuItem key={option.key} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="end"
              mt={2}
            >
              <Stack direction="row" spacing={1}>
                <Button variant="contained">Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={formik.isSubmitting}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </form>
  );
}

const CreateDepartmentModal = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      await noticeboardService.addNoticeDepartment({ name: value });
      queryClient.invalidateQueries({ queryKey: ["noticeDepartment"] });
      showToast("Department added!");
      setOpen(false);
    } catch (error) {
      showToast("Failed to add department!", "error");
    }
  };
  return (
    <>
      <Button
        sx={{ color: "#999", p: 0, h: 0 }}
        size="small"
        onClick={handleClickOpen}
      >
        Add new Department
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Department</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "300px",
            }}
            mt={2}
          >
            <CustomTextField
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={!value} onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
