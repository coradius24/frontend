import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import StudentSearchAutoComplete from "../components/forms/StudentSearchAutoComplete";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ReviewAdd = ({ formik, courseNames, isLoading }) => {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    formik.setFieldValue("attachment", file);
  };

  const handleVideoThumbnailFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    formik.setFieldValue("videoThumbnail", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    formik.setFieldValue('attachment', '')
  }, [formik.values.attachmentType])

  return (
    <Stack>
      <Box mt="-40px">
        <CustomFormLabel htmlFor="reviewTye">Review type</CustomFormLabel>
        <CustomAutoComplete
          name="reviewTye"
          id="reviewTye"
          value={formik.values.reviewTye}
          onChange={formik.handleChange}
          options={[
            {
              name: "Custom",
              value: "custom",
            },
            {
              name: "User specific",
              value: "user",
            },
          ].map((level) => ({
            label: `${level.name}`,
            value: level.value,
          }))}
        />
        {formik.errors.level && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {" "}
            {formik.errors.attachmentType}{" "}
          </FormHelperText>
        )}
      </Box>
      {formik.values.reviewTye === "user" ? (
        <Box mt="-10px">
          <CustomFormLabel htmlFor="userId">Select User</CustomFormLabel>
          <StudentSearchAutoComplete
            name="userId"
            id="userId"
            value={formik.values.userId}
            onChange={formik.handleChange}
          />
          {formik.errors.userId && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {" "}
              {formik.errors.userId}{" "}
            </FormHelperText>
          )}
        </Box>
      ) : (
        <>
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="reviewerName">
              Reviewer Name
            </CustomFormLabel>
            <CustomTextField
              id="reviewerName"
              multiline
              name="reviewerName"
              value={formik.values.reviewerName}
              onChange={formik.handleChange}
              error={
                formik.touched.reviewerName &&
                Boolean(formik.errors.reviewerName)
              }
              helperText={
                formik.touched.reviewerName && formik.errors.reviewerName
              }
              placeholder="Reviewer Name"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mb={3}>
            <div className="upload-aria">
              <div
                className="drop-zone"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
              >
                {formik.values.reviewerPhoto && (
                  <img
                    style={{
                      maxWidth: "220px",
                      borderRadius: "10px",
                    }}
                    className="preview-img"
                    src={URL.createObjectURL(formik.values.reviewerPhoto)}
                    alt="Selected Files"
                  />
                )}

                <Typography variant="h6">Reviewer Photo</Typography>
              </div>

              <input
                style={{ display: "none" }}
                id="reviewerPhoto"
                accept="image/*"
                type="file"
                name="reviewerPhoto"
                onChange={handleFileSelect}
              />
              <label htmlFor="reviewerPhoto">
                <span>Browse files</span>
              </label>
            </div>
          </Box>
        </>
      )}
      <Box mt={"-10px"} mb={0}>
        <CustomFormLabel htmlFor="courseId">Select Course</CustomFormLabel>
        <CustomAutoComplete
          name="courseId"
          id="courseId"
          value={formik.values.courseId}
          onChange={formik.handleChange}
          options={courseNames?.map((course) => ({
            label: `${course.title} ${course.batchTitle}`,
            value: course.id,
          }))}
        />
        {formik.errors.courseId && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {" "}
            {formik.errors.userId}{" "}
          </FormHelperText>
        )}
      </Box>
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="comment">Comment</CustomFormLabel>
        <CustomTextField
          id="comment"
          multiline
          name="comment"
          value={formik.values.comment}
          onChange={formik.handleChange}
          error={formik.touched.comment && Boolean(formik.errors.comment)}
          helperText={formik.touched.comment && formik.errors.comment}
          placeholder="Comment"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box>
        <Box mt={"15px"} display={"flex"} gap={2} alignItems={"center"}>
          <Typography fontWeight={600} variant="p">
            Rating:
          </Typography>
          <Rating
            size="small"
            name="review"
            onChange={(_, newValue) => {
              formik.setFieldValue("rating", newValue || 1);
            }}
            value={formik.values.rating}
          />
        </Box>
      </Box>
      <Box mt="-15px">
        <CustomFormLabel htmlFor="attachmentType">
          Attachment Type
        </CustomFormLabel>
        <CustomAutoComplete
          name="attachmentType"
          id="attachmentType"
          value={formik.values.attachmentType}
          onChange={formik.handleChange}
          options={[
            {
              name: "Image",
              value: "image",
            },
            {
              name: "Video",
              value: "video",
            },
          ].map((level) => ({
            label: `${level.name}`,
            value: level.value,
          }))}
        />
        {formik.errors.level && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {" "}
            {formik.errors.attachmentType}{" "}
          </FormHelperText>
        )}
      </Box>
 
      {formik.values.attachmentType === "image" ? (
        <Box mb={3}>
          <div className="upload-aria">
            <div
              className="drop-zone"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >
              {formik.values.attachment && (
                <img
                  style={{
                    maxWidth: "220px",
                    borderRadius: "10px",
                  }}
                  className="preview-img"
                  src={URL.createObjectURL(formik.values.attachment)}
                  alt="Selected Files"
                />
              )}

              <Typography variant="h6">Attachment</Typography>
            </div>

            <input
              style={{ display: "none" }}
              id="file-upload"
              accept="image/*"
              type="file"
              name="attachment"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <span> Browse files</span>
            </label>
          </div>
        </Box>
      ) : (
        <>
        <Box>
          <Typography mt={2}>
            <div className="upload-aria">
            {formik.values.attachment && <Typography sx={{textAlign: 'center'}}>1 File Uploaded</Typography>}

              <Button
                component="label"
                variant="outline"
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                Upload Video
                <VisuallyHiddenInput
                  accept="video/*"
                  type="file"
                  name="attachment"
                  onChange={handleFileSelect}
                />
              </Button>
            </div>
          </Typography>
        </Box>
        <>
      <Box mb={3}>
          <div className="upload-aria">
            <div
              className="drop-zone"
              onDrop={handleVideoThumbnailFileDrop}
              onDragOver={handleDragOver}
            >
              {formik.values.videoThumbnail && (
                <img
                  style={{
                    maxWidth: "220px",
                    borderRadius: "10px",
                  }}
                  className="preview-img"
                  src={URL.createObjectURL(formik.values.videoThumbnail)}
                  alt="Selected Photo"
                />
              )}

              <Typography variant="h6">Video Thumbnail</Typography>
            </div>

            <input
              style={{ display: "none" }}
              id="thumbnail-upload"
              accept="image/*"
              type="file"
              name="videoThumbnail"
              onChange={handleFileSelect}
            />
            <label htmlFor="thumbnail-upload">
              <span> Browse files</span>
            </label>
          </div>
        </Box>
      </>
        </>
      )}

      <Stack
        mt={5}
        direction="column"
        display={"flex"}
        justifyContent="flex-end"
      >
        {isLoading ? (
          <LoadingButton loading variant="contained">
            Add Review
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Add Review
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default ReviewAdd;
