"use client";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Box from "@mui/material/Box";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
const Pricing = ({ formik }) => {
  return (
    <Box maxWidth={"500px"} margin={"0 auto"} noValidate autoComplete="off">
      <Box mb={"10px"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Check If FREE Course"
            name="isFreeCourse"
            checked={formik.values.isFreeCourse}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </Box>
      {!formik.values.isFreeCourse && (
        <>
          <Box mt={"-20px"}>
            <CustomFormLabel htmlFor="price">
              Regular Course Price
            </CustomFormLabel>
            <CustomTextField
              id="price"
              name="price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              placeholder="Course Price"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mt={"10px"}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Check If There discounted Price this Course"
                name="discountFlag"
                checked={formik.values.discountFlag}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </Box>
          {formik.values.discountFlag && (
            <Box mt={"-20px"}>
              <CustomFormLabel htmlFor="discountedPrice">
                Discounted Course Price
              </CustomFormLabel>
              <CustomTextField
                id="discountedPrice"
                name="discountedPrice"
                type="discountedPrice"
                value={formik.values.discountedPrice}
                onChange={formik.handleChange}
                placeholder="Discounted Course Price"
                variant="outlined"
                fullWidth
              />
            </Box>
          )}
          <Box mb={"10px"} mt={1}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Allow Partial Payment Enrollment"
                name="allowPartialPaymentEnrollment"
                checked={formik.values.allowPartialPaymentEnrollment}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </Box>
          <Box mt={"-25px"}>
            <CustomFormLabel htmlFor="minimumPartialPayment">
              Minimum Partial Payment
            </CustomFormLabel>
            <CustomTextField
              id="minimumPartialPayment"
              name="minimumPartialPayment"
              value={formik.values.minimumPartialPayment}
              onChange={formik.handleChange}
              placeholder="Minimum Partial Payment"
              variant="outlined"
              type="number"
              fullWidth
            />
          </Box>
          <Box mb={"10px"}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Allow Wallet"
                name="allowWallet"
                checked={formik.values.allowWallet}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </Box>
          <Box mb={"10px"}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Allow Smart Link Generation"
                name="allowSmartLinkGeneration"
                checked={formik.values.allowSmartLinkGeneration}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </Box>
          <Box mb={"10px"}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Allow Earning Report"
                name="allowEarningReport"
                checked={formik.values.allowEarningReport}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </Box>
          <Box mb={"10px"}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Is Feature Course"
                name="isFeaturedCourse"
                checked={formik.values.isFeaturedCourse}
                onChange={formik.handleChange}
              />
            </FormGroup>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Pricing;
