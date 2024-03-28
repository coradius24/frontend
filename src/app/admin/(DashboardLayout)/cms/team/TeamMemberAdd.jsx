import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

const TeamMemberAdd = ({ formik, isLoading, buttonLabel }) => {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue(e.target.name, file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    formik.setFieldValue("photo", file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Stack>
      <Box mt={"-40px"}>
        <CustomFormLabel htmlFor="fullName">FullName</CustomFormLabel>
        <CustomTextField
          id="fullName"
          multiline
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
          placeholder="Full Name"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="title">Title</CustomFormLabel>
        <CustomTextField
          id="title"
          multiline
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          placeholder="Title"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box mt={"5px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Is visible for Public"
            name="isPublic"
            checked={formik.values.isPublic}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box>
      <Box mb={3}>
        <div className="upload-aria">
          <div
            className="drop-zone"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            {formik.values.photo && (
              <img
                style={{
                  maxWidth: "220px",
                  borderRadius: "10px",
                }}
                className="preview-img"
                src={
                  formik.values.photo?.url ||
                  URL.createObjectURL(formik.values.photo)
                }
                alt="Selected Files"
              />
            )}

            <Typography variant="h6">Photo</Typography>
          </div>

          <input
            style={{ display: "none" }}
            id="photo"
            accept="image/*"
            type="file"
            name="photo"
            onChange={handleFileSelect}
          />
          <label htmlFor="photo" style={{ cursor: "pointer" }}>
            <span>Browse files</span>
          </label>
        </div>
      </Box>
      <Box mt={-5}>
        {" "}
        <CustomFormLabel htmlFor="socialLinks">Social Links</CustomFormLabel>
      </Box>
      <Box mt={"-20px"}>
        <CustomFormLabel htmlFor="facebook">Facebook</CustomFormLabel>
        <CustomTextField
          id="socialLinks.facebook"
          name="socialLinks.facebook"
          type="url"
          value={formik.values.socialLinks.facebook}
          onChange={formik.handleChange}
          placeholder="Facebook profile url"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="socialLinks.twitter">Twitter</CustomFormLabel>
        <CustomTextField
          id="socialLinks.twitter"
          name="socialLinks.twitter"
          type="url"
          value={formik.values.socialLinks.twitter}
          onChange={formik.handleChange}
          placeholder="Twitter profile url"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Box mt={"-10px"}>
        <CustomFormLabel htmlFor="socialLinks.linkedin">
          Linkedin
        </CustomFormLabel>
        <CustomTextField
          id="socialLinks.linkedin"
          type="url"
          name="socialLinks.linkedin"
          value={formik.values.socialLinks.linkedin}
          onChange={formik.handleChange}
          placeholder="Linkedin profile url"
          variant="outlined"
          fullWidth
        />
      </Box>
      <Stack
        mt={2}
        direction="column"
        display={"flex"}
        justifyContent="flex-end"
      >
        {isLoading ? (
          <LoadingButton loading variant="contained">
            {buttonLabel || "Add Team Member"}
          </LoadingButton>
        ) : (
          <Button variant="contained" fullWidth type="submit">
            {buttonLabel || "Add Team Member"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default TeamMemberAdd;
