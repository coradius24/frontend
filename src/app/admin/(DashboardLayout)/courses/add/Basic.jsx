"use client";
import courseService from "@/services/courseService";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Box from "@mui/material/Box";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import CustomAutoComplete from "../../components/forms/theme-elements/CustomAutoComplete";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

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

const Basic = ({ formik, data, handleDate }) => {
  const {
    isPending,
    error,
    data: adminMainCourses,
  } = useQuery({
    queryKey: ["adminMainCourses"],
    queryFn: () => courseService.getCourseNames({ isMainCourse: true }),
    initialData: [],
  });
  console.log({ adminMainCourses });
  return (
    <Box maxWidth={"500px"} margin={"0 auto"} autoComplete="off">
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="title">Course Title</CustomFormLabel>
        <CustomTextField
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          placeholder="Course Title"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="shortDescription">
          Short Description
        </CustomFormLabel>
        <CustomTextField
          id="shortDescription"
          multiline
          maxRows={4}
          name="shortDescription"
          value={formik.values.shortDescription}
          onChange={formik.handleChange}
          error={
            formik.touched.shortDescription &&
            Boolean(formik.errors.shortDescription)
          }
          helperText={
            formik.touched.shortDescription && formik.errors.shortDescription
          }
          placeholder="Short Description"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box mt="-10px">
        <CustomFormLabel htmlFor="categoryId">Select Category</CustomFormLabel>
        <CustomAutoComplete
          id="categoryId"
          name="categoryId"
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          groupBy={(option) => {
            return (
              flatCategories(data)?.find((cat) => cat.value == option)
                ?.groupBy || "Others"
            );
          }}
          options={flatCategories(data) || []}
        />
        {formik.errors.courseId && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {" "}
            {formik.errors.userId}{" "}
          </FormHelperText>
        )}
      </Box>
      <Box mt="-10px">
        <CustomFormLabel htmlFor="level">Course Level</CustomFormLabel>
        <CustomAutoComplete
          name="level"
          id="level"
          value={formik.values.level}
          onChange={formik.handleChange}
          options={[
            {
              name: "Beginner",
              value: "beginner",
            },
            {
              name: "Intermediate",
              value: "intermediate",
            },
            {
              name: "Advanced",
              value: "advanced",
            },
          ].map((level) => ({
            label: `${level.name}`,
            value: level.value,
          }))}
        />
        {formik.errors.level && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {" "}
            {formik.errors.userId}{" "}
          </FormHelperText>
        )}
      </Box>
      <Box mt={"5px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Is Batch Course"
            name="isBatchCourse"
            value={formik.values.isBatchCourse}
            checked={formik.values.isBatchCourse}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box>
      {formik.values.isBatchCourse && (
        <Box mt="-10px">
          <CustomFormLabel htmlFor="parentCourseId">
            Select Main Course
          </CustomFormLabel>
          <CustomAutoComplete
            id="parentCourseId"
            name="parentCourseId"
            value={formik.values.parentCourseId}
            onChange={formik.handleChange}
            options={adminMainCourses?.map((course) => ({
              label: `${course.title} ${course.batchTitle}`,
              value: course.id,
            }))}
          />
          {formik.errors.parentCourseId && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {" "}
              {formik.errors.parentCourseId}{" "}
            </FormHelperText>
          )}
        </Box>
      )}
      <Box mt={"5px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Is top course"
            name="isTopCourse"
            value={formik.values.isTopCourse}
            checked={formik.values.isTopCourse}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box>
      {/* <Box mt={"5px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Enable Drip Content"
            name="enableDripContent"
            value={formik.values.enableDripContent}
            checked={formik.values.enableDripContent}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box> */}
      <Box mt={"5px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Enable Course Support"
            name="enableSupport"
            value={formik.values.enableSupport}
            checked={formik.values.enableSupport}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box>
      {formik.values.enableSupport && (
        <Box mt="-10px">
          <CustomFormLabel htmlFor="supportDepartment">
            Support Department
          </CustomFormLabel>
          <CustomAutoComplete
            name="supportDepartment"
            id="supportDepartment"
            value={formik.values.supportDepartment}
            onChange={formik.handleChange}
            options={[
              {
                name: "CPA BETA",
                value: "cpa-beta",
              },
              {
                name: "DATA BETA",
                value: "data-beta",
              },
            ].map((level) => ({
              label: `${level.name}`,
              value: level.value,
            }))}
          />
        </Box>
      )}
      <Box mt={"5px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Allow Course Certificate"
            name="allowCertificate"
            value={formik.values.allowCertificate}
            checked={formik.values.allowCertificate}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box>
      {formik.values.allowCertificate && (
        <Box mt={"-10px"}>
          <CustomFormLabel htmlFor="minLessonCompletionRequiredForCertificate">
            Minimum Lesson complete for certificate
          </CustomFormLabel>
          <CustomTextField
            id="minLessonCompletionRequiredForCertificate"
            name="minLessonCompletionRequiredForCertificate"
            value={formik.values.minLessonCompletionRequiredForCertificate}
            onChange={formik.handleChange}
            placeholder="Minimum Lesson complete for certificate"
            variant="outlined"
            type="number"
            fullWidth
          />
        </Box>
      )}
      <Box mt="-10px">
        <CustomFormLabel htmlFor="status">Course Status</CustomFormLabel>
        <CustomAutoComplete
          name="status"
          id="status"
          value={formik.values.status}
          onChange={formik.handleChange}
          options={[
            {
              name: "Published",
              value: "active",
            },
            {
              name: "Private",
              value: "private",
            },
            {
              name: "Archived",
              value: "archived",
            },
            {
              name: "Completed",
              value: "completed",
            },
          ].map((level) => ({
            label: `${level.name}`,
            value: level.value,
          }))}
        />
      </Box>
      <Box mt="-10px">
        <CustomFormLabel htmlFor="contentType">Course Type</CustomFormLabel>
        <CustomAutoComplete
          name="contentType"
          id="contentType"
          value={formik.values.contentType}
          onChange={formik.handleChange}
          options={[
            {
              name: "Recorded",
              value: "recorded",
            },
            {
              name: "Live",
              value: "live",
            },
          ].map((level) => ({
            label: `${level.name}`,
            value: level.value,
          }))}
        />
        {formik.errors.level && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {" "}
            {formik.errors.contentType}{" "}
          </FormHelperText>
        )}
      </Box>
      {formik.values.contentType === "live" && (
        <Box autoComplete="off">
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="batchTitle">Batch Title</CustomFormLabel>
            <CustomTextField
              id="batchTitle"
              name="batchTitle"
              value={formik.values.batchTitle}
              onChange={formik.handleChange}
              error={
                formik.touched.batchTitle && Boolean(formik.errors.batchTitle)
              }
              helperText={formik.touched.batchTitle && formik.errors.batchTitle}
              placeholder="Batch Title"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="liveClassSchedule">
              Schedule Text
            </CustomFormLabel>
            <CustomTextField
              id="liveClassSchedule"
              multiline
              maxRows={4}
              name="liveClassSchedule"
              value={formik.values.liveClassSchedule}
              onChange={formik.handleChange}
              error={
                formik.touched.liveClassSchedule &&
                Boolean(formik.errors.liveClassSchedule)
              }
              helperText={
                formik.touched.liveClassSchedule &&
                formik.errors.liveClassSchedule
              }
              placeholder="Short Description"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mt={"-10px"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CustomFormLabel htmlFor="enrollmentDeadLine">
                Enrollment End Date line {formik.enrollmentDeadline}
              </CustomFormLabel>
              <DatePicker
                sx={{ width: "100%", marginTop: "5px" }}
                placeHolder="Enrollment Dead line"
                format="DD/MM/YYYY"
                value={dayjs(formik.values.enrollmentDeadline || new Date())}
                defaultValue={dayjs(
                  formik.values.enrollmentDeadline || new Date()
                )}
                name="enrollmentDeadLine"
                onChange={(value) => handleDate(value)}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Basic;
