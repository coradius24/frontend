import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormHelperText,
  IconButton,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import * as yup from "yup";

import apiService from "@/services/api/apiService";
import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { IoMdAddCircle } from "react-icons/io";
import StudentSearchAutoComplete from "../components/forms/StudentSearchAutoComplete";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "../components/forms/theme-elements/CustomSelect";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const paymentMethods = [
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "BKash Manual",
    value: "bkashManual",
  },
  {
    label: "Nagad Manual",
    value: "nagadManual",
  },
];

const DiscountType = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
};

const CreatePaymentModal = () => {
  const [isInvoice, setIsInvoice] = useState(false);
  const validationSchema = yup.object({
    userId: yup.string().required("User is Required"),
    courseId: yup.string().required("Course is Required"),
    ...(isInvoice
      ? {
          paymentMethod: yup.string().required("Payment method is Required"),
          amount: yup.string().required("Amount is Required"),
        }
      : {}),
  });

  const [open, setOpen] = React.useState(false);
  const [couponApplied, setCouponApplied] = React.useState(false);
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
      paymentMethod: "",
      courseId: "",
      amount: "",
      userId: "",
      couponApplied: "",
      transactionId: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (isInvoice) {
        apiService
          .post("/api/admin/payments", values)
          .then((res) => {
            if (res?.paymentId) {
              showToast("Successfully enrolled!");
              formik.resetForm();
              queryClient.invalidateQueries(["adminEnrollments"]);
              handleClose();
            } else {
              showToast(res?.message || "Fail!", "error");
            }
          })
          .then(() => {
            setSubmitting(false);
          });
      } else {
        apiService
          .post("/api/admin/enrollments", {
            courseId: values.courseId,
            userId: values.userId,
          })
          .then((res) => {
            if (res?.error) {
              return showToast(res?.message, "error");
            }
            if (res?.providerId) {
              showToast("Successfully enrolled!");
              formik.resetForm();
              queryClient.invalidateQueries(["adminEnrollments"]);
              handleClose();
            } else {
              showToast(res?.message || "Fail!", "error");
            }
          })
          .then(() => {
            setSubmitting(false);
          });
      }
    },
  });

  return (
    <>
      <Button
        sx={{ width: "200px" }}
        startIcon={<IoMdAddCircle />}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Enroll Student
      </Button>

      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Create Enroll</DialogTitle>
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
          <Box mt={"-25px"} mb={"10px"}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox {...label} />}
                label="Generate Invoice"
                checked={isInvoice}
                onChange={() => setIsInvoice(!isInvoice)}
              />
            </FormGroup>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Box mt="-30px" mb={0}>
                <CustomFormLabel>Select Course</CustomFormLabel>
                <CustomAutoComplete
                  name="courseId"
                  value={formik.values.courseId}
                  onChange={formik.handleChange}
                  options={courseNames?.map((course) => ({
                    label: `${course.title} ${course.batchTitle}`,
                    value: course.id,
                  }))}
                />
                {formik.errors.courseId && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.userId}{" "}
                  </FormHelperText>
                )}
              </Box>
              <Box mt="-10px" mb={3}>
                <CustomFormLabel>Select User</CustomFormLabel>
                <StudentSearchAutoComplete
                  name="userId"
                  value={formik.values.userId}
                  onChange={formik.handleChange}
                />
                {formik.errors.userId && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.userId}{" "}
                  </FormHelperText>
                )}
              </Box>
              {isInvoice && (
                <>
                  <Box sx={{ my: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <TextField
                          id="outlined-basic"
                          label="Amount"
                          variant="outlined"
                          fullWidth
                          sx={{ width: 250 }}
                          type="number"
                          name="amount"
                          value={formik.values.amount}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          id="outlined-basic"
                          label="Transaction Id"
                          variant="outlined"
                          fullWidth
                          type="text"
                          sx={{ width: 250 }}
                          name="transactionId"
                          value={formik.values.transactionId}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box mt={"-5px"}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox {...label} defaultChecked />}
                        label="Coupon Applied"
                        checked={couponApplied}
                        onChange={() => setCouponApplied(!couponApplied)}
                      />
                    </FormGroup>
                  </Box>
                  <Box>
                    {couponApplied && (
                      <TextField
                        id="outlined-basic"
                        label="Coupon Code"
                        variant="outlined"
                        fullWidth
                        type="text"
                        sx={{ width: 250 }}
                        name="couponApplied"
                        value={formik.values.couponApplied}
                        onChange={formik.handleChange}
                      />
                    )}
                  </Box>
                  <Box mt="-15px" mb={3}>
                    <CustomFormLabel>Payment Method</CustomFormLabel>
                    <CustomSelect
                      labelId="payment-method-select"
                      id="paymentMethod"
                      fullWidth
                      name="paymentMethod"
                      value={formik.values.paymentMethod}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {paymentMethods?.map((paymentMethod) => (
                        <MenuItem
                          key={paymentMethod.value}
                          value={paymentMethod.value}
                        >
                          {paymentMethod.label}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                    {formik.errors.paymentMethod && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {" "}
                        {formik.errors.paymentMethod}{" "}
                      </FormHelperText>
                    )}
                  </Box>
                </>
              )}
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  disabled={formik.isSubmitting}
                  variant="contained"
                  type="submit"
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
