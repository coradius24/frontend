import AppTextEditor from "@/components/AppTextEditor";
import courseService from "@/services/courseService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
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
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import * as yup from "yup";
import CustomAutoComplete from "../../components/forms/theme-elements/CustomAutoComplete";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import { HtmlTooltip } from "../../components/shared/UiFunction";

function getVimeoVideoId(vimeoVideoLink) {
  const match = vimeoVideoLink.match(/\/(\d+)$/);
  return match ? match[1] : null;
}

async function getVimeoVideoInfo(vimeoVideoLink) {
  const videoId = getVimeoVideoId(vimeoVideoLink);

  if (videoId) {
    try {
      const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer 39258384b69994dba483c10286825b5c`,
        },
      });

      if (response.ok) {
        const video = await response.json();
        const duration = video.duration;
        return { id: videoId, duration };
      } else {
        console.error(
          "Error fetching Vimeo video information:",
          response.statusText
        );
        return 0;
      }
    } catch (error) {
      console.error("Error fetching Vimeo video information:", error.message);
      return 0;
    }
  } else {
    console.error("Invalid Vimeo video URL");
    return 0;
  }
}

async function getYouTubeVideoDuration(youtubeVideoLink) {
  const videoId = getYouTubeVideoId(youtubeVideoLink);

  if (videoId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyAZjsv-gM7tsCRUQnYODd1_eo8t7MG5kSA&part=contentDetails`
      );

      if (response.ok) {
        const videoData = await response.json();
        const duration = videoData.items[0].contentDetails.duration;
        const durationInSeconds = parseYouTubeDuration(duration);

        return { id: videoId, duration: durationInSeconds };
      } else {
        console.error(
          "Error fetching YouTube video information:",
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching YouTube video information:", error.message);
      return null;
    }
  } else {
    console.error("Invalid YouTube video URL");
    return null;
  }
}

function getYouTubeVideoId(youtubeVideoLink) {
  const match = youtubeVideoLink.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function parseYouTubeDuration(duration) {
  // Parse the YouTube duration format (ISO 8601) and convert it to seconds
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

const validationSchema = yup.object({
  title: yup.string().required("Title is Required"),
  sectionId: yup.string().required("Section is Required"),
});

// https://vimeo.com/888170876
const AddLessonModal = ({
  open,
  setOpen,
  children,
  sectionsCurriculum,
  lessonId,
  sectionId,
}) => {
  const params = useParams();
  const radioGroupRef = useRef(null);
  const [htmlVideoDuration, setHtmlVideoDuration] = useState(0);
  const [order, setOrder] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      courseId: params.id,
      sectionId: "",
      videoUrl: "",
      lessonType: "",
      summary: "",
      videoType: "",
      isFree: false,
      durationInSecond: 0,
      rewardCoupon: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = { ...values };
        if (
          data.lessonType === "video" &&
          !data.videoUrl &&
          formik.values.videoType !== "vimeo"
        ) {
          setSubmitting(false);
          return showToast("Video URL is Required!", "error");
        }
        if (
          data.lessonType !== "upcomingLiveClass" &&
          data.lessonType !== "article"
        ) {
          if (
            data.videoUrl &&
            data.videoType === "YouTube" &&
            data.videoUrl.includes("youtube")
          ) {
            data.attachmentType = "url";
            data.videoType = "YouTube";
            delete data.cloudVideoId;
          } else if (data.videoUrl && data.videoType === "vimeo") {
            data.cloudVideoId = parseInt(getVimeoVideoId(data.videoUrl));
            data.videoType = "vimeo";
            data.attachmentType = "id";
            delete data.videoUrl;
          } else if (
            data.videoType === "customUrl" &&
            !data.videoUrl.includes("vimeo") &&
            !data.videoUrl.includes("youtube")
          ) {
            data.durationInSecond = parseInt(htmlVideoDuration);
            delete data.cloudVideoId;
          } else {
            return showToast("Invalid video url or video type", "error");
          }
        }

        if (data.videoType === "vimeo" && data.cloudVideoId) {
          data.attachmentType = "id";
        } else if (data.videoType && data.videoUrl) {
          data.attachmentType = "url";
        }

        if (data.lessonType === "upcomingLiveClass") {
          delete data.cloudVideoId;
          delete data.videoType;
          delete data.videoUrl;
          delete data.durationInSecond;
        }

        data.order = parseInt(order);
        if (lessonId) {
          const res = await courseService.updateLesson(lessonId, data);
          setSubmitting(false);
          if (res.affected) {
            showToast("Successfully Lesson Updated!");
            formik.resetForm();
            queryClient.invalidateQueries("adminCourseModules");
            handleClose();
          } else {
            showToast(res.message, "error");
          }
        } else {
          const res = await courseService.createLesson(data);
          setSubmitting(false);
          if (res.createdAt) {
            formik.resetForm();
            showToast("Successfully Lesson Added!");
            queryClient.invalidateQueries("adminCourseModules");
          } else {
            showToast(res.message, "error");
          }
        }
      } catch (error) {
        showToast(error.message, "error");
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  useEffect(() => {
    if (sectionId && lessonId) {
      const section = sectionsCurriculum.find(
        (section) => section.id === parseInt(sectionId)
      );
      const data = section?.lessons.find(
        (lesson) => lesson.id === parseInt(lessonId)
      );
      if (data) {
        formik.setValues({ ...data });
        if (data.videoType === "vimeo") {
          const url = `https://vimeo.com/${data.cloudVideoId}`;
          formik.setFieldValue("videoUrl", url);
        }
      }
    }
  }, [sectionId, lessonId, sectionsCurriculum]);

  useEffect(() => {
    if (formik.videoType !== "customUrl") {
      if (formik.values.videoUrl && formik.values.videoUrl.includes("vimeo")) {
        getVimeoVideoInfo(formik.values.videoUrl)
          .then((videoInfo) => {
            formik.values.durationInSecond = videoInfo.duration;
          })
          .catch((err) => {
            showToast(err.message, "error");
          });
      } else if (
        formik.values.videoUrl &&
        formik.values.videoUrl.includes("youtube")
      ) {
        getYouTubeVideoDuration(formik.values.videoUrl)
          .then((videoInfo) => {
            if (videoInfo) {
              formik.values.durationInSecond = videoInfo.duration;
            }
          })
          .catch((err) => {
            showToast(err.message, "error");
          });
      }
    }
  }, [formik.values.videoUrl, formik.values.videoType]);

  useEffect(() => {
    if (formik.values.sectionId && !lessonId) {
      const selectedSection = sectionsCurriculum.find(
        (item) => item.id === formik.values.sectionId
      );
      let length = selectedSection.lessons.length;
      setOrder(length + 1);
    } else if (formik.values.sectionId && lessonId) {
      setOrder(formik.values.order || 1);
    }
  }, [formik.values.sectionId, lessonId]);

  return (
    <>
      {children}
      <Dialog
        TransitionProps={{ onEntering: handleEntering }}
        keepMounted
        maxWidth="sm"
        fullWidth
        open={open}
      >
        {formik.values.videoUrl && formik.values.videoType === "customUrl" && (
          <VideoDurationChecker
            videoUrl={formik.values.videoUrl}
            setHtmlVideoDuration={setHtmlVideoDuration}
          />
        )}
        <DialogTitle>
          <Box display={"flex"} alignItems={"center"} gap={"5px"}>
            {lessonId ? "Update Lesson" : "Add New Lesson"}
            <span>
              <HtmlTooltip
                title={
                  <>
                    <Typography color="inherit">Video URL Format:</Typography>
                    <em>{"Youtube Video URL:"}</em>{" "}
                    <strong>
                      {"https://www.youtube.com/watch?v=RBYJTop1e-g"}
                    </strong>{" "}
                    <br />
                    <em>{"Vimeo Video URL:"}</em>{" "}
                    <strong>https://vimeo.com/888170876</strong>
                  </>
                }
              >
                <InfoIcon />
              </HtmlTooltip>
            </span>
          </Box>{" "}
        </DialogTitle>
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
            <Box>
              <Box mt={"-30px"}>
                <CustomFormLabel htmlFor="title">Title</CustomFormLabel>
                <CustomTextField
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  placeholder="Lesson Title"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="sectionId">Section</CustomFormLabel>
                <CustomAutoComplete
                  name="sectionId"
                  id="sectionId"
                  value={formik.values.sectionId}
                  onChange={formik.handleChange}
                  options={sectionsCurriculum.map((section) => ({
                    label: section.title,
                    value: section.id,
                  }))}
                />
                {formik.errors.sectionId && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.sectionId}{" "}
                  </FormHelperText>
                )}
              </Box>
              {order && (
                <Box mt={"-10px"}>
                  <CustomFormLabel htmlFor="lessonOrder">
                    Lesson Order
                  </CustomFormLabel>
                  <CustomTextField
                    type="number"
                    min={1}
                    id="lessonOrder"
                    name="lessonOrder"
                    value={order}
                    onChange={({ target }) =>
                      setOrder(() => {
                        return target.value || 1;
                      })
                    }
                    placeholder="Lesson Order"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
              )}
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="lessonType">
                  Lesson Type
                </CustomFormLabel>
                <CustomAutoComplete
                  name="lessonType"
                  id="lessonType"
                  value={formik.values.lessonType}
                  onChange={formik.handleChange}
                  options={[
                    {
                      name: "Video",
                      value: "video",
                    },
                    {
                      name: "Upcoming Live Class",
                      value: "upcomingLiveClass",
                    },
                    {
                      name: "Live Class Record",
                      value: "liveClassRecord",
                    },
                    {
                      name: "Article",
                      value: "article",
                    },
                    {
                      name: "Feedback",
                      value: "feedback",
                    },
                  ].map((level) => ({
                    label: `${level.name}`,
                    value: level.value,
                  }))}
                />
                {formik.errors.lessonType && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {" "}
                    {formik.errors.lessonType}{" "}
                  </FormHelperText>
                )}
              </Box>
              {(formik.values.lessonType === "feedback" ||
                formik.values.lessonType === "video" ||
                formik.values.lessonType === "liveClassRecord") && (
                <Box mt={"-10px"}>
                  <CustomFormLabel htmlFor="videoType">
                    Video Type
                  </CustomFormLabel>
                  <CustomAutoComplete
                    name="videoType"
                    id="videoType"
                    value={formik.values.videoType}
                    onChange={formik.handleChange}
                    options={[
                      {
                        name: "YouTube",
                        value: "YouTube",
                      },
                      {
                        name: "Vimeo",
                        value: "vimeo",
                      },
                      {
                        name: "Custom URL",
                        value: "customUrl",
                      },
                    ].map((level) => ({
                      label: `${level.name}`,
                      value: level.value,
                    }))}
                  />
                  {formik.errors.videoType && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {" "}
                      {formik.errors.videoType}{" "}
                    </FormHelperText>
                  )}
                </Box>
              )}
              {(formik.values.lessonType === "feedback" ||
                formik.values.lessonType === "video" ||
                formik.values.lessonType === "liveClassRecord") &&
                formik.values.videoType !== "vimeo" && (
                  <Box mt={"-10px"}>
                    <CustomFormLabel htmlFor="videoUrl">
                      Video Url
                    </CustomFormLabel>
                    <CustomTextField
                      id="videoUrl"
                      name="videoUrl"
                      value={formik.values.videoUrl}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.videoUrl &&
                        Boolean(formik.errors.videoUrl)
                      }
                      helperText={
                        formik.touched.videoUrl && formik.errors.videoUrl
                      }
                      placeholder="Video URL"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                )}
              {formik.values.videoType === "vimeo" && (
                <Box mt={"-10px"}>
                  <CustomFormLabel htmlFor="videoUrl">
                    Video URL
                  </CustomFormLabel>
                  <CustomTextField
                    id="videoUrl"
                    name="videoUrl"
                    value={formik.values.videoUrl}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.videoUrl && Boolean(formik.errors.videoUrl)
                    }
                    helperText={
                      formik.touched.videoUrl && formik.errors.videoUrl
                    }
                    placeholder="Video URL"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
              )}
              {formik.values.lessonType === "feedback" && (
                <Box mt={"-10px"}>
                  <CustomFormLabel htmlFor="rewardCoupon">
                    Reward Coupon
                  </CustomFormLabel>
                  <CustomTextField
                    id="rewardCoupon"
                    name="rewardCoupon"
                    value={formik.values.rewardCoupon}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.rewardCoupon &&
                      Boolean(formik.errors.rewardCoupon)
                    }
                    helperText={
                      formik.touched.rewardCoupon && formik.errors.rewardCoupon
                    }
                    placeholder="Reward Coupon for discount"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
              )}
              <Box mt={"-10px"}>
                <CustomFormLabel htmlFor="summary">Summary</CustomFormLabel>
                <AppTextEditor
                  inputLabel="Summary*"
                  value={formik.values.summary}
                  onChange={(value) => formik.setFieldValue("summary", value)}
                  name="body"
                  height={150}
                  error={
                    formik.touched.summary && Boolean(formik.errors.summary)
                  }
                  helperText={formik.touched.summary && formik.errors.summary}
                />
              </Box>
              <Box mb={"10px"}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Mark as free lesson"
                    name="isFree"
                    checked={formik.values.isFree}
                    onChange={formik.handleChange}
                  />
                </FormGroup>
              </Box>
              <Stack mt={5} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddLessonModal;

const VideoDurationChecker = ({ videoUrl, setHtmlVideoDuration }) => {
  const playerRef = useRef(null);

  const handleDuration = (videoDuration) => {
    if (videoDuration > 0) {
      setHtmlVideoDuration(videoDuration);
    }
  };

  return (
    <div style={{ display: "none" }}>
      <ReactPlayer
        onDuration={handleDuration}
        ref={playerRef}
        url={videoUrl}
        config={{ file: { attributes: { controlsList: "nodownload" } } }}
      />
    </div>
  );
};
