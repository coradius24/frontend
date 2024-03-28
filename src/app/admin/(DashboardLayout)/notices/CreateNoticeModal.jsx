import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Typography,
  LinearProgress,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as yup from 'yup';

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useTheme } from "@mui/material/styles";
import { IoMdAddCircle } from "react-icons/io";
import courseService from "@/services/courseService";
import { Field, Form, Formik, useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import CustomFormLabel from "../components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "../components/forms/theme-elements/CustomSelect";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";
import CustomAutoComplete from "../components/forms/theme-elements/CustomAutoComplete";
import StudentSearchAutoComplete from "../components/forms/StudentSearchAutoComplete";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
]

const paymentMethods = [
  {
    label: 'Cash',
    value: 'cash'
  },
  {
    label: 'BKash Manual',
    value: 'bkashManual'
  },
  {
    label: 'Nagad Manual',
    value: 'nagadManual'
  },

]


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const DiscountType = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
};

const validationSchema = yup.object({
  paymentMethod: yup.string().required('Payment Method is Required'),
});


const CreateNoticeModal = () => {
  const [open, setOpen] = React.useState(false);
  const [personName, setPersonName] = React.useState([]);
  const [discountType, setDiscountType] = React.useState(DiscountType.FIXED);
  // const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState('');

  const handleDiscountTypeChange = (event) => {
    setDiscountType(event.target.value);
  };

  const { isPending: loadingCourseNames, data: courseNames } = useQuery({
    queryKey: ['courseNames'],
    queryFn: () => courseService.getCourseNames()
  })


  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };


  const formik = useFormik({
    initialValues: {
      paymentMethod: '',
      courseId: '',
    },
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values));
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
        Create Payment
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack direction="row" spacing={2}>
              {/* <Avatar src={data.user?.photo} sx={{ width: 40, height: 40 }} /> */}
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {/* {payload?.user?.fullName} */}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  {/* {payload?.user?.email}  */}
                </Typography>
              </Box>
              <Typography variant="h1" fontWeight="600">
                {/* $ {payload?.amount} */}
              </Typography>
            </Stack>
          </DialogContentText>

          <Box sx={{ my: 2 }}>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  id="outlined-basic"
                  label="Code"
                  variant="outlined"
                  fullWidth
                  sx={{ width: 250 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-basic"
                  label="Discount Amount"
                  variant="outlined"
                  fullWidth
                  sx={{ width: 250 }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker sx={{ width: 250 }} label="Start Date" />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker sx={{ width: 250 }} label="Expiry Date" />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          {discountType === "percentage" && (
            <FormControl fullWidth sx={{ mt: 2.8 }}>
              <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={personName}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Course Ids" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item>
                <RadioGroup
                  aria-label="discount-type"
                  name="discount-type"
                  value={discountType}
                  onChange={handleDiscountTypeChange}
                  row
                >
                  <FormControlLabel
                    value={DiscountType.FIXED}
                    control={<Radio />}
                    label="Discount Type"
                  />
                  <FormControlLabel
                    value={DiscountType.PERCENTAGE}
                    control={<Radio />}
                    label="Coupon Scope"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Box>
          main
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Box mt="-10px" mb={3}>
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
                  {paymentMethods?.map((paymentMethod) => <MenuItem key={paymentMethod.value} value={paymentMethod.value}>{paymentMethod.label}</MenuItem>)}
                </CustomSelect>
                {formik.errors.paymentMethod && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {' '}
                    {formik.errors.paymentMethod}{' '}
                  </FormHelperText>
                )}
              </Box>
              <Box mt="10px" mb={3}>
                <CustomFormLabel>Payment Method</CustomFormLabel>
                <CustomAutoComplete
                  name="courseId"
                  value={formik.values.courseId}
                  onChange={formik.handleChange}
                  options={
                   courseNames?.map(course => ({
                      label: `${course.title} ${course.batchTitle}`,
                      value: course.id,
                    }))
                  }
                />

                


              </Box>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ mb: 2 }}>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateNoticeModal;
