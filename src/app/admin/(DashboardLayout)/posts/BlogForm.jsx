"use client";

import { Box, Button, FormHelperText, Typography } from "@mui/material";

import CustomTextField from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

import CustomFormLabel from "@/app/admin/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel";
import AppTextEditor from "@/components/AppTextEditor";
import blogService from "@/services/blogService";
import instructorService from "@/services/instructorService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { TagsInput } from "react-tag-input-component";
import * as yup from "yup";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import ParentCard from "../components/shared/ParentCard";
import { uploadImage } from "../courses/add/page";

const validationSchema = yup.object({
  title: yup.string().required("Title is Required"),
  body: yup.string().required("Body is Required"),
  categoryId: yup.string().required("Category is Required"),
  authorId: yup.string().required("Author is Required"),
});

export default function BlogForm() {
  const {
    isPending,
    error,
    data: instructors,
  } = useQuery({
    queryKey: ["adminInstructors"],
    queryFn: () => instructorService.getInstructors({ limit: 100, page: 1 }),
    initialData: {},
  });

  console.log({ instructors });

  const { isPending: loadingCategories, data: categories } = useQuery({
    queryKey: ["admin-blogs-categories"],
    queryFn: () => blogService.getCategories(),
    initialData: [],
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
      categoryId: null,
      authorId: null,
      metaKeywords: [],
      metaDescription: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = { ...values };
        data.metaKeywords = data.metaKeywords.join(",");
        if (data.thumbnail) {
          const file = await uploadImage(data.thumbnail);
          data.thumbnailId = file.id;
          delete data.thumbnail;
        }
        blogService
          .createBlog(data)
          .then((res) => {
            if (res.raw) {
              showToast("Blog Created Successfully");
              queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            } else {
              showToast(res.message, "error");
            }
          })
          .finally(() => {
            setSubmitting(false);
          });
      } catch (error) {
        console.log(error);
      }
    },
  });
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("thumbnail", file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    formik.setFieldValue("thumbnail", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <ParentCard padding={"20px 20px"} title="Add New Blog Post">
        <Box mt={"-15px"}>
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
        <Box mt="-10px">
          <CustomFormLabel htmlFor="categoryId">Blog Category</CustomFormLabel>
          <CustomAutoComplete
            name="categoryId"
            id="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          {formik.errors.categoryId && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {" "}
              {formik.errors.categoryId}{" "}
            </FormHelperText>
          )}
        </Box>
        <Box mt="-10px">
          <CustomFormLabel htmlFor="authorId">Blog Author</CustomFormLabel>
          <CustomAutoComplete
            name="authorId"
            id="authorId"
            value={formik.values.authorId}
            onChange={formik.handleChange}
            options={instructors?.results?.map((instructor) => ({
              label: instructor.fullName,
              value: instructor.id,
            }))}
          />
          {formik.errors.authorId && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {" "}
              {formik.errors.authorId}{" "}
            </FormHelperText>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="h6" mb={1}>
            Meta Keywords
          </Typography>
          <TagsInput
            value={formik.values.metaKeywords}
            onChange={(value) =>
              formik.setFieldValue("metaKeywords", value || [])
            }
            name="metaKeywords"
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
        </Box>
        <Box mb={3}>
          <div className="upload-aria">
            <div
              className="drop-zone"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >
              {formik.values.thumbnail && (
                <img
                  style={{
                    maxWidth: "220px",
                    borderRadius: "10px",
                  }}
                  className="preview-img"
                  src={URL.createObjectURL(formik.values.thumbnail)}
                  alt="Selected Files"
                />
              )}

              <Typography variant="h6">Thumbnail</Typography>
              <p>
                Drag and drop file <br />
              </p>
            </div>

            <input
              style={{ display: "none" }}
              id="file-upload"
              accept="image/*"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <span> Browse file</span>
            </label>
          </div>
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
        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button
            sx={{ marginLeft: "auto", padding: "15px 35px" }}
            type="submit"
            variant="contained"
            color="success"
            disabled={formik.isSubmitting}
          >
            Save
          </Button>
        </Box>
      </ParentCard>
    </form>
  );
}
