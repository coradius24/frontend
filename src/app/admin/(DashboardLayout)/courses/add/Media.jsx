"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CustomAutoComplete from "../../components/forms/theme-elements/CustomAutoComplete";
import CustomAutoCompleteMultiSelect from "../../components/forms/theme-elements/CustomAutoCompleteMultiSelect";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

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

const Media = ({
  formik,
  instructorData,
  selectedCoInstructor,
  setSelectedCoInstructor,
  handleFileUpload,
  file,
}) => {
  return (
    <Box
      maxWidth={"500px"}
      margin={"0 auto"}
      noValidate
      mb={"20px"}
      autoComplete="off"
    >
      <Box mt="-10px">
        <CustomFormLabel htmlFor="courseOverviewProvider">
          Course Overview Provider
        </CustomFormLabel>
        <CustomAutoComplete
          name="courseOverviewProvider"
          id="courseOverviewProvider"
          value={formik.values.courseOverviewProvider}
          onChange={formik.handleChange}
          options={[
            {
              name: "Youtube",
              value: "YouTube",
            },
            {
              name: "Vimeo",
              value: "vimeo",
            },
          ].map((level) => ({
            label: `${level.name}`,
            value: level.value,
          }))}
        />
      </Box>
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="videoUrl">Overview Video Url</CustomFormLabel>
        <CustomTextField
          id="videoUrl"
          name="videoUrl"
          value={formik.values.videoUrl}
          onChange={formik.handleChange}
          error={formik.touched.videoUrl && Boolean(formik.errors.videoUrl)}
          helperText={formik.touched.videoUrl && formik.errors.videoUrl}
          placeholder="Video Url"
          variant="outlined"
          fullWidth
        />
      </Box>
      {!!formik.values.thumbnail && !file && (
        <Box mb={3}>
          <div className="upload-aria">
            <div className="drop-zone">
              <img
                style={{
                  maxWidth: "100%",
                  borderRadius: "10px",
                  maxHeight: "300px",
                }}
                className="preview-img"
                src={formik.values.thumbnail}
                alt="Selected Files"
              />
            </div>
          </div>
        </Box>
      )}
      {!!file && (
        <Box mb={3}>
          <div className="upload-aria">
            <div className="drop-zone">
              <img
                style={{
                  maxWidth: "100%",
                  borderRadius: "10px",
                }}
                className="preview-img"
                src={URL.createObjectURL(file)}
                alt="Selected Files"
              />
            </div>
          </div>
        </Box>
      )}
      <Typography mt={2}>
        <Button
          component="label"
          variant="contained"
          fullWidth
          startIcon={<CloudUploadIcon />}
        >
          Upload Thumbnail Image
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
        </Button>
      </Typography>
      <Box margin={"0 auto"} maxWidth={"500px"} mt="-10px" mb={0}>
        <CustomFormLabel htmlFor="main-instructor">
          Main Instructor{" "}
        </CustomFormLabel>
        <CustomAutoComplete
          id="main-instructor"
          name="instructor"
          value={formik.values.instructor}
          onChange={formik.handleChange}
          options={instructorData?.map((instructor) => ({
            label: `${instructor.fullName}`,
            value: instructor.id,
          }))}
        />
      </Box>
      <Box margin={"0 auto"} maxWidth={"500px"} mt="10px" mb={0}>
        <CustomFormLabel htmlFor="coInstructors">
          Co Instructors{" "}
        </CustomFormLabel>
        <CustomAutoCompleteMultiSelect
          id="coInstructors"
          name="coInstructors"
          value={formik.values.coInstructors}
          onChange={formik.handleChange}
          options={instructorData?.map((item) => ({
            label: item.fullName,
            value: item.id,
          }))}
        />
      </Box>
    </Box>
  );
};

export default Media;
