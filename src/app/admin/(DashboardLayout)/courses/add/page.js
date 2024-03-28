"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import apiService from "@/services/api/apiService";
import categoryService from "@/services/categoryService";
import courseService from "@/services/courseService";
import userService from "@/services/userService";
import { showToast } from "@/utils/lib";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Tab } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import * as React from "react";
import { TagsInput } from "react-tag-input-component";
import * as yup from "yup";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import { arrayToObject } from "../[id]/CourseInfo";
import Basic from "./Basic";
import Info from "./Info";
import Media from "./Media";
import Pricing from "./Pricing";

const BCrumb = [
  {
    to: "/admin/courses",
    title: "Courses",
  },
  {
    title: "Course Create",
  },
];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const validationSchema = yup.object({
  title: yup.string().required("Course title is required"),
  shortDescription: yup
    .string()
    .required("Course Short description is required"),
  categoryId: yup.string().required("Course Category is Required"),
  instructor: yup.string().required("Course Instructor is Required"),
  metaDescription: yup.string().required("Meta Description is Required"),
});

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      let response = await apiService.put(`/api/admin/files`, formData, config);
      response = await response.json();
      return response;
    } catch (error) {
      if (error.statusCode === 413) {
        showToast("File size too large, try less than 100kb", "error");
      }
    }
  } catch (err) {
    //
  }
};

export default function BasicTabs() {
  const router = useRouter();
  const [metaKeywords, setMetaKeywords] = React.useState([]);
  const [file, setFile] = React.useState(null);

  const { data } = useQuery({
    queryKey: ["adminCourseCategories"],
    queryFn: () => categoryService.getCateGory(),
  });

  const { data: instructorData } = useQuery({
    queryKey: ["adminInstructor"],
    queryFn: () => userService.getInstructors(),
  });

  const [value, setValue] = React.useState(0);
  const [numTabs] = React.useState(5);

  const handleNext = () => {
    setValue((prevValue) => (prevValue === numTabs ? 0 : prevValue + 1));
  };

  const handlePrevious = () => {
    setValue((prevValue) => (prevValue === 0 ? numTabs - 1 : prevValue - 1));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const handleDate = (value) => {
    formik.setValues({
      ...formik.values,
      enrollmentDeadline: value,
    });
  };

  const handleFileUpload = async (event) => {
    setFile(event.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      shortDescription: "",
      outcomes: [{ value: "", id: `outcomes__${Date.now()}` }],
      whatsIn: [{ value: "", id: `whatsIn__${Date.now()}` }],
      requirements: [{ value: "", id: `requirements__${Date.now()}` }],
      faqs: [{ value: "", faq: "", id: `faq__${Date.now()}` }],
      categoryId: 0,
      discountFlag: false,
      price: 0,
      discountedPrice: 0,
      discounted: 0,
      level: "beginner",
      instructor: 0,
      coInstructors: [],
      videoUrl: "",
      thumbnail: 0,
      status: "PRIVATE",
      courseOverviewProvider: "",
      metaKeywords: [],
      metaDescription: "",
      isFeaturedCourse: false,
      isFreeCourse: false,
      isTopCourse: true,
      parentCourseId: 0,
      isBatchCourse: false,
      enableDripContent: false,
      contentType: "live",
      enrollmentDeadline: "",
      batchTitle: "",
      liveClassSchedule: "",
      allowPartialPaymentEnrollment: true,
      minimumPartialPayment: 0,
      allowWallet: true,
      allowSmartLinkGeneration: true,
      allowEarningReport: true,
      enableSupport: true,
      supportDepartment: "cpa-beta",
      allowCertificate: false,
      minLessonCompletionRequiredForCertificate: 0,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let data = {
          ...values,
        };

        if (!data.isBatchCourse) {
          delete data.parentCourseId;
        }
        delete data.isBatchCourse;
        data.requirements = values.requirements.map((item) => item.value);
        data.outcomes = values.outcomes.map((item) => item.value);
        data.whatsIn = values.whatsIn.map((item) => item.value);
        data.metaKeywords = metaKeywords;

        const formattedFaq = values.faqs.map((item) => {
          return {
            [item.faq]: item.value,
          };
        });

        if (data.discountedPrice == 0) {
          data.discountedPrice = data.price;
        }

        data.faqs = arrayToObject(formattedFaq);
        const thumbnail = await uploadImage(file);
        data.thumbnail = thumbnail.id;
        const res = await courseService.createCourse(data);
        setSubmitting(false);
        if (res.statusCode === 500) {
          return showToast(res.message, "error");
        } else if (res.id) {
          formik.resetForm();
          showToast("Course Created Successfully");
          router.push("/admin/courses");
        }
      } catch (error) {
        showToast(error.message, "error");
        setSubmitting(false);
      }
    },
  });

  return (
    <PageContainer title="Create Course" description="Create Course">
      <Breadcrumb title="Create Course" items={BCrumb} />
      <form id="course-add-form" onSubmit={formik.handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              centered
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Basic" {...a11yProps(0)} />
              <Tab label="Info" {...a11yProps(1)} />
              <Tab label="Pricing" {...a11yProps(2)} />
              <Tab label="Media & Instructors" {...a11yProps(3)} />
              <Tab label="SEO" {...a11yProps(4)} />
              <Tab label="Finish" {...a11yProps(5)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Basic formik={formik} data={data} handleDate={handleDate} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Info
              formik={formik}
              handleInputChange={handleInputChange}
              handleRemoveFaq={handleRemoveFaq}
              handleArrayValueChange={handleArrayValueChange}
              handleRemoveArrayItems={handleRemoveArrayItems}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Pricing formik={formik} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Media
              formik={formik}
              handleFileUpload={handleFileUpload}
              instructorData={instructorData}
              file={file}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
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
                value={metaKeywords}
                onChange={setMetaKeywords}
                name="fruits"
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
                    formik.touched.metaDescription &&
                    formik.errors.metaDescription
                  }
                  placeholder="Meta Description"
                  variant="outlined"
                  fullWidth
                />
              </Box>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <Box
              maxWidth={"500px"}
              margin={"0 auto"}
              noValidate
              display={"flex"}
              flexDirection={"column"}
              mb={"20px"}
              justifyContent={"center"}
              autoComplete="off"
            >
              <Box minWidth={"100%"} width={"100%"}>
                {Object.keys(formik.errors).length > 0 && (
                  <div>
                    <strong>Errors:</strong>
                    <ul>
                      {Object.values(formik.errors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Box>
              <Button
                variant="contained"
                type="submit"
                id="course-add-form"
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </Box>
          </CustomTabPanel>
          <Box
            maxWidth={"500px"}
            margin={"0 auto"}
            noValidate
            display={"flex"}
            mb={"20px"}
            justifyContent={"center"}
            justifyItems={"center"}
            autoComplete="off"
          >
            <Button
              onClick={handlePrevious}
              startIcon={<NavigateBeforeIcon />}
              disabled={value == 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              endIcon={<NavigateNextIcon />}
              disabled={value === numTabs}
            >
              Next
            </Button>
          </Box>
        </Box>
      </form>
    </PageContainer>
  );
}
