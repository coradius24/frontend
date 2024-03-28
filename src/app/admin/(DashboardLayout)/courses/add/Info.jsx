"use client";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Fab, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

const Info = ({
  formik,
  handleInputChange,
  handleRemoveFaq,
  handleArrayValueChange,
  handleRemoveArrayItems,
}) => {
  return (
    <Box maxWidth={"500px"} margin={"0 auto"} autoComplete="off">
      <Box mb={"10px"}>
        <Typography mt={2} variant="h4">
          Faqs (অনলাইন কোর্স সম্পর্কে সকল প্রশ্ন)
        </Typography>
      </Box>
      {formik.values.faqs.map((faq, index) => (
        <Box key={faq.id} autoComplete="off">
          <div className="faq-item" style={{ position: "relative" }}>
            <CustomFormLabel htmlFor={`faq__${index}`}>
              FAQ Question
            </CustomFormLabel>
            <CustomTextField
              id={`faq__${index}`}
              type="string"
              name="faq"
              multiline
              maxRows={4}
              value={faq.faq}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Faq question"
              variant="outlined"
              fullWidth
            />
            <Fab
              color="warning"
              sx={{
                position: "absolute",
                right: -70,
              }}
              size="small"
              onClick={() => handleRemoveFaq(index)}
            >
              <CloseIcon />
            </Fab>
          </div>
          <Box mt={"-15px"}>
            <CustomFormLabel htmlFor={`faq__value${index}`}>
              FAQ Answer
            </CustomFormLabel>
            <CustomTextField
              id={`faq__value${index}`}
              variant="outlined"
              fullWidth
              multiline
              maxRows={4}
              placeholder="FAQ answer"
              name="value"
              margin="dense"
              value={faq.value}
              onChange={(event) => handleInputChange(index, event)}
            />
          </Box>
        </Box>
      ))}
      <Box
        mt="10px"
        mb={0}
        alignContent={"center"}
        justifyItems={"center"}
        justifyContent={"center"}
      >
        <Button
          variant="contained"
          type="button"
          onClick={() => {
            formik.setValues({
              ...formik.values,
              faqs: [
                ...formik.values.faqs,
                {
                  value: "",
                  faq: "",
                  id: `faq__${Date.now()}__${Math.random()}`,
                },
              ],
            });
          }}
        >
          Add More FAQs
        </Button>
      </Box>
      <Typography mt={2} mb={"10px"} variant="h4">
        Requirements (কোর্সটি করার জন্য আপনাকে যা জানা থাকা প্রয়োজন)
      </Typography>
      {formik.values.requirements.map((requirement, index) => (
        <Box mb={"20px"} key={requirement.id}>
          <div className="faq-item" style={{ position: "relative" }}>
            <CustomTextField
              id={`faq__${index}`}
              type="string"
              name="requirements"
              multiline
              maxRows={4}
              value={requirement.value}
              onChange={(event) =>
                handleArrayValueChange(requirement.id, event)
              }
              placeholder="Requirements"
              variant="outlined"
              fullWidth
            />
            <Fab
              color="warning"
              sx={{
                position: "absolute",
                right: -70,
              }}
              size="small"
              onClick={() =>
                handleRemoveArrayItems(requirement.id, "requirements")
              }
            >
              <CloseIcon fontSize="14px" />
            </Fab>
          </div>
        </Box>
      ))}
      <Box
        mt="10px"
        mb={0}
        alignContent={"center"}
        justifyItems={"center"}
        justifyContent={"center"}
      >
        <Button
          variant="contained"
          type="button"
          onClick={() => {
            formik.setValues({
              ...formik.values,
              requirements: [
                ...formik.values.requirements,
                {
                  value: "",
                  id: `requirements__${Date.now()}__${Math.random()}`,
                },
              ],
            });
          }}
        >
          Add More Requirements
        </Button>
      </Box>
      <Typography mt={2} mb={"10px"} variant="h4">
        Outcomes (এই কোর্স থেকে কী কী শিখবেন?)
      </Typography>
      {formik.values.outcomes.map((outcome, index) => (
        <Box mb={"20px"} key={outcome.id}>
          <div className="faq-item" style={{ position: "relative" }}>
            <CustomTextField
              id="outlined-basic"
              placeholder="Outcomes"
              variant="outlined"
              fullWidth
              multiline
              maxRows={4}
              type="string"
              name="outcomes"
              value={outcome.value}
              onChange={(event) => handleArrayValueChange(outcome.id, event)}
            />
            <Fab
              color="warning"
              sx={{
                position: "absolute",
                right: -70,
              }}
              size="small"
              onClick={() => handleRemoveArrayItems(outcome.id, "outcomes")}
            >
              <CloseIcon fontSize="14px" />
            </Fab>
          </div>
        </Box>
      ))}
      <Box
        mt="10px"
        mb={0}
        alignContent={"center"}
        justifyItems={"center"}
        justifyContent={"center"}
      >
        <Button
          variant="contained"
          type="button"
          onClick={() => {
            formik.setValues({
              ...formik.values,
              outcomes: [
                ...formik.values.outcomes,
                { value: "", id: `outcomes__${Date.now()}__${Math.random()}` },
              ],
            });
          }}
        >
          Add More Outcomes
        </Button>
      </Box>
      <Typography mt={2} mb={"10px"} variant="h4">
        WhatsIn (এই কোর্সে আপনি যা যা পাচ্ছেন)
      </Typography>
      {formik.values.whatsIn?.map((outcome, index) => (
        <Box mb={"20px"} key={outcome.id}>
          <div className="faq-item" style={{ position: "relative" }}>
            <CustomTextField
              id="outlined-basic"
              placeholder="WHat's included"
              variant="outlined"
              fullWidth
              multiline
              maxRows={4}
              type="string"
              name="whatsIn"
              value={outcome.value}
              onChange={(event) => handleArrayValueChange(outcome.id, event)}
            />
            <Fab
              color="warning"
              sx={{
                position: "absolute",
                right: -70,
              }}
              size="small"
              onClick={() => handleRemoveArrayItems(outcome.id, "whatsIn")}
            >
              <CloseIcon fontSize="14px" />
            </Fab>
          </div>
        </Box>
      ))}
      <Box
        mt="10px"
        mb={0}
        alignContent={"center"}
        justifyItems={"center"}
        justifyContent={"center"}
      >
        <Button
          variant="contained"
          type="button"
          onClick={() => {
            formik.setValues({
              ...formik.values,
              whatsIn: [
                ...formik.values.whatsIn,
                { value: "", id: `whatsIn__${Date.now()}__${Math.random()}` },
              ],
            });
          }}
        >
          Add More
        </Button>
      </Box>
    </Box>
  );
};

export default Info;
