import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import * as yup from "yup";

import couponService from "@/services/couponService";
import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { isValidDate } from "@/utils/utils";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import CustomAutoCompleteMultiSelect from "../components/forms/theme-elements/CustomAutoCompleteMultiSelect";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";

const validationSchema = yup.object({
  code: yup.string().required("Code is Required"),
  purpose: yup.string().required("Purpose is Required"),
  discountAmount: yup.string().required("Discount amount is Required"),
  discountType: yup.string().required("Discount t is Required"),
  scope: yup.string().required("Scope is Required"),
});

const CreatePaymentModal = ({ open, setOpen, selected }) => {
  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ["courseNames"],
    queryFn: () => courseService.getCourseNames(),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      discountAmount: "",
      discountType: "",
      code: "",
      scope: "",
      startDate: "",
      expiry: "",
      isExpireDate: true,
      courseIds: [],
      purpose: 'general'
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        ...values,
      };
      if (selected) {
        const res = await couponService.updateCoupon(selected.id, data);
        setSubmitting(false);
        if (res?.statusCode === 500) {
          return showToast(res?.message, "error");
        }
        if (res?.affected) {
          showToast("Successfully updated!");
          formik.resetForm();
          queryClient.invalidateQueries(["adminCoupons"]);
          setOpen(false);
        } else {
          return showToast(res?.message, "error");
        }
      } else {
        const res = await couponService.createCoupon(data);
        setSubmitting(false);
        if (res.statusCode) {
          return showToast(res?.message, "error");
        } else {
          showToast("Successfully created!");
          formik.resetForm();
          queryClient.invalidateQueries(["adminCoupons"]);
          setOpen(false);
        }
      }
    },
  });

  const handleDate = (name, date) => {
    if (isValidDate(date)) {
      const dateObj = new Date(date);
      const timestamp = dateObj.toISOString();
      formik.values[name] = timestamp;
    }
  };

  useEffect(() => {
    if (selected) {
      const data = {
        code: selected.code,
        discountAmount: selected.discountAmount,
        discountType: selected.discountType,
        scope: selected.scope,
        startDate: selected.startDate,
        purpose: selected.purpose,
        courseIds: selected.courseIds || [],
        expiry: selected.expiry,
      };
      if (selected.scope === "courseSpecific") {
        data.courseIds = selected.courseIds.map((item) => parseInt(item));
      }
      formik.setValues({
        ...data,
      });
    }
  }, [selected]);

  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Create Coupon
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open}>
        <DialogTitle>Create Coupon Code</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Box>
                <TextField
                  id="outlined-basic"
                  label="Coupon Code"
                  variant="outlined"
                  fullWidth
                  type="string"
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                />
                {formik.errors.code && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.code}
                  </FormHelperText>
                )}
              </Box>
              <Box mt={2}>
                <TextField
                  id="outlined-basic"
                  label="Discount Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="discountAmount"
                  value={formik.values.discountAmount}
                  onChange={formik.handleChange}
                />
                {formik.errors.discountAmount && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.discountAmount}
                  </FormHelperText>
                )}
              </Box>
              <Box>
                <CustomFormLabel>Select Discount Type</CustomFormLabel>
                <CustomAutoComplete
                  name="discountType"
                  placeholder={"Select Discount Type"}
                  value={formik.values.discountType}
                  onChange={formik.handleChange}
                  options={["Flat", "Percentage"]?.map((type) => ({
                    label: type,
                    value: type.toLocaleLowerCase(),
                  }))}
                />
                {formik.errors.discountType && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.discountType}
                  </FormHelperText>
                )}
              </Box>
              <Box>
                <CustomFormLabel>Select Discount Code Scope</CustomFormLabel>
                <CustomAutoComplete
                  name="scope"
                  placeholder={"Select Discount Code Scope"}
                  value={formik.values.scope}
                  onChange={formik.handleChange}
                  options={[
                    { value: "allCourses", label: "All Courses" },
                    { value: "courseSpecific", label: "Selected Course Only" },
                  ]?.map((type) => ({
                    label: type.label,
                    value: type.value,
                  }))}
                />
                {formik.errors.scope && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.scope}
                  </FormHelperText>
                )}
              </Box>
              <Box>
                <CustomFormLabel>Select Purpose</CustomFormLabel>
                <CustomAutoComplete
                  name="purpose"
                  placeholder={"Select Purpose"}
                  value={formik.values.purpose}
                  onChange={formik.handleChange}
                  options={[
                    { value: "general", label: "General" },
                    { value: "videoFeedbackReward", label: "Course Video Feedback reward" },
                  ]?.map((type) => ({
                    label: type.label,
                    value: type.value,
                  }))}
                />
                {formik.errors.purpose && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.purpose}
                  </FormHelperText>
                )}
              </Box>
              {formik.values.scope === "courseSpecific" && (
                <Box mt={"-10"}>
                  <CustomFormLabel htmlFor="courseIds">
                    Courses{" "}
                  </CustomFormLabel>
                  <CustomAutoCompleteMultiSelect
                    id="courseIds"
                    name="courseIds"
                    value={formik.values.courseIds || []}
                    onChange={formik.handleChange}
                    options={courseNames?.map((option) => ({
                      label: `${option.title} ${option.batchTitle}`,
                      value: option.id,
                    }))}
                  />
                </Box>
              )}
              <Box mt={"-10px"}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <CustomFormLabel htmlFor="startDate">
                    Start Date
                  </CustomFormLabel>
                  <DatePicker
                    id="startDate"
                    sx={{ width: "100%", marginTop: "5px" }}
                    placeHolder="Coupon expire date"
                    format="DD/MM/YYYY"
                    value={dayjs(formik.values.startDate || new Date())}
                    defaultValue={dayjs(formik.values.startDate || new Date())}
                    disablePast
                    name="startDate"
                    onChange={(value) => handleDate("startDate", value)}
                  />
                </LocalizationProvider>
              </Box>
              <Box mt={"5px"}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Is Expire Date"
                    name="isExpireDate"
                    checked={formik.values.isExpireDate}
                    onChange={formik.handleChange}
                  />
                </FormGroup>
              </Box>
              {formik.values.isExpireDate && (
                <Box mt={"-25px"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CustomFormLabel htmlFor="expiry">
                      Coupon expire Date
                    </CustomFormLabel>
                    <DatePicker
                      id="expiry"
                      sx={{ width: "100%", marginTop: "5px" }}
                      placeHolder="Coupon expire date"
                      format="DD/MM/YYYY"
                      value={dayjs(formik.values.expiry || new Date())}
                      defaultValue={dayjs(formik.values.expiry || new Date())}
                      disablePast
                      name="expiry"
                      onChange={(value) => handleDate("expiry", value)}
                    />
                  </LocalizationProvider>
                </Box>
              )}

              <Stack mt={5} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePaymentModal;
