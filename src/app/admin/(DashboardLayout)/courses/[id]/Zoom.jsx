import AppTextEditor from "@/components/AppTextEditor";
import liveClassService from "@/services/liveClassService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Box, Button, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageContainer from "../../components/container/PageContainer";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

const Zoom = () => {
  const params = useParams();
  const [isOnGoing, setIsOnGoing] = useState(false);
  const router = useRouter();
  const { isPending, error, data } = useQuery({
    queryKey: ["adminLiveClass", params.id],
    queryFn: () => liveClassService.getLiveClassAdmin(params.id),
    initialData: [],
  });

  const formik = useFormik({
    initialValues: {
      dateTime: Date.now(),
      noteToStudents: "",
      zoomMeetingLink: "",
      zoomMeetingId: "",
      zoomMeetingPassword: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const data = { ...values };
      const res = await liveClassService.createLiveClass({
        ...data,
        courseId: params.id,
      });
      setSubmitting(false);
      if (res.statusCode === 500 || res.statusCode === 400) {
        showToast(res.message, "error");
      } else {
        queryClient.invalidateQueries(["adminLiveClass", params.id]);
        showToast("Successfully Updated!");
      }
    },
  });

  useEffect(() => {
    if (data.length > 0) {
      formik.setValues({ ...data[0] });
      setIsOnGoing(data[0]["isOnGoing"]);
    }
  }, [data]);

  const handleLiveClass = (status) => {
    try {
      SweetAlert.fire({
        title: "Are you sure?",
        text: `You want to ${isOnGoing ? "stop" : "start"} live class!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${isOnGoing ? "stop" : "start"}!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await liveClassService.updateOngoingLiveClass(
              data[0].id,
              {
                isOnGoing: status,
              }
            );
            if (res.success) {
              queryClient.invalidateQueries(["adminLiveClass"]);
              showToast(`Successfully Update!`);
              setIsOnGoing(status);
            }
          } catch (error) {
            showToast("Failed to Update", "error");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    liveClassService.deleteLiveClass(params.id).then((res) => {
      showToast("Class deleted!");
      router.replace("/admin/courses");
      queryClient.invalidateQueries(["adminLiveClass", params.id]);
    });
  };

  return (
    <PageContainer
      title="Course Details"
      description="Course Details also course edit"
    >
      {/* <Box sx={{ "& > :not(style)": { m: 1 }, position: "relative" }}>
        <HtmlTooltip
          title={
            <>
              <Typography color="inherit">
                {" "}
                {isOnGoing ? "Class Is Ongoing" : "Class Start Schedule"}
              </Typography>
              {data.length > 0 && (
                <>
                  <strong>{dateWithTime(data[0].dateTime)}</strong>
                  <br />
                  {isOnGoing ? (
                    <strong>Do You want stop now? Click the button.</strong>
                  ) : (
                    <strong>Do You want start now? Click the button.</strong>
                  )}
                </>
              )}
            </>
          }
        >
          <Fab
            onClick={() => handleLiveClass(!isOnGoing)}
            variant="extended"
            color="primary"
            sx={{
              position: "absolute",
              right: "50px",
              background: isOnGoing ? "red" : "",
            }}
          >
            <LiveTv sx={{ mr: 1 }} />
            {isOnGoing ? "Stop Live Class" : "Start Live Class"}
          </Fab>
        </HtmlTooltip>
      </Box> */}
      <form onSubmit={formik.handleSubmit}>
        <Box
          maxWidth={"500px"}
          margin={"0 auto"}
          noValidate
          mb={"20px"}
          autoComplete="off"
        >
          <Box mt={"-10px"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                <CustomFormLabel
                  style={{ marginBottom: "-16px", position: "relative" }}
                  htmlFor="dateTime"
                >
                  Live Class Date & Time
                  {/* <IoClose onClick={() => formik.setFieldValue("dateTime", null)} style={{
                    position: 'absolute',
                    right: '50px',
                    top: '50px',
                    fontSize: '20px',
                    color: "#888",
                    cursor: "pointer",
                    zIndex: 99
                  }} /> */}
                </CustomFormLabel>

                <DateTimePicker
                  fullWidth
                  value={dayjs(formik.values.dateTime)}
                  id="dateTime"
                  format="DD/MM/YYYY/  hh:mm a"
                  ampm
                  views={[
                    "day",
                    "month",
                    "year",
                    "hours",
                    "minutes",
                    "seconds",
                  ]}
                  onChange={(newValue) =>
                    formik.setFieldValue("dateTime", newValue)
                  }
                  error={false}
                />
                {/* </Box> */}
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="noteToStudents">
              Note to students
            </CustomFormLabel>

            <AppTextEditor
              id="noteToStudents"
              inputLabel="content*"
              value={formik.values.noteToStudents}
              onChange={(value) =>
                formik.setFieldValue("noteToStudents", value)
              }
              name="body"
              height={200}
              maxRows={4}
              placeholder="Note to students"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="zoomMeetingLink">
              Zoom meeting link
            </CustomFormLabel>
            <CustomTextField
              id="zoomMeetingLink"
              name="zoomMeetingLink"
              value={formik.values.zoomMeetingLink}
              onChange={formik.handleChange}
              error={
                formik.touched.zoomMeetingLink &&
                Boolean(formik.errors.zoomMeetingLink)
              }
              helperText={
                formik.touched.zoomMeetingLink && formik.errors.zoomMeetingLink
              }
              placeholder=" Zoom meeting link"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="zoomMeetingId">
              Zoom meeting Id
            </CustomFormLabel>
            <CustomTextField
              id="zoomMeetingId"
              name="zoomMeetingId"
              value={formik.values.zoomMeetingId}
              onChange={formik.handleChange}
              error={
                formik.touched.zoomMeetingId &&
                Boolean(formik.errors.zoomMeetingId)
              }
              helperText={
                formik.touched.zoomMeetingId && formik.errors.zoomMeetingId
              }
              placeholder="Zoom meeting Id"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mt={"-10px"}>
            <CustomFormLabel htmlFor="zoomMeetingPassword">
              Zoom meeting password
            </CustomFormLabel>
            <CustomTextField
              id="zoomMeetingPassword"
              name="zoomMeetingPassword"
              value={formik.values.zoomMeetingPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.zoomMeetingPassword &&
                Boolean(formik.errors.zoomMeetingPassword)
              }
              helperText={
                formik.touched.zoomMeetingPassword &&
                formik.errors.zoomMeetingPassword
              }
              placeholder="Zoom meeting password"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Stack direction="row" gap={2}>
            <Button
              sx={{ mt: "10px" }}
              type="button"
              color="error"
              variant="contained"
              disabled={formik.isSubmitting}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              sx={{ mt: "10px" }}
              type="submit"
              fullWidth
              variant="contained"
              disabled={formik.isSubmitting}
            >
              UPDATE
            </Button>
          </Stack>
        </Box>
      </form>
    </PageContainer>
  );
};

export default Zoom;
