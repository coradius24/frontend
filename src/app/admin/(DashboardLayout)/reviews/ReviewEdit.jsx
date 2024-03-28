import { Box, Button, Stack, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import { useEffect } from "react";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

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

const ReviewEdit = ({ formik }) => {
  console.log("formik.values", formik.values)
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
      <Box mt={"-40px"}>
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
        <Box mt={1} display={"flex"} gap={2} alignItems={"center"}>
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
      {/* {formik.values.attachmentType === "image" ? (
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
      )} */}
      <Stack mt={5} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting}
        >
          Update
        </Button>
      </Stack>
    </Stack>
  );
};

export default ReviewEdit;
