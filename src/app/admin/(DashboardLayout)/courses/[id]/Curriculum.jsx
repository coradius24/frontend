import useApp from "@/hooks/useApp";
import courseService from "@/services/courseService";
import { formatDuration, showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useQueryState } from "next-usequerystate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete, MdEdit, MdPlayCircle } from "react-icons/md";
import AddLessonModal from "./AddLessonModal";
import AddSectionModal from "./AddSectionModal";

const Curriculum = ({ sectionsCurriculum = [] }) => {
  const { user } = useApp();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [openLessonModal, setOpenLessonModal] = useState(false);
  const [lessonId, setLessonId] = useQueryState("lesson");
  const [sectionId, setSectionId] = useQueryState("section");

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredSectionIndex, setHoveredSectionIndex] = useState(null);
  const [hoveredContentType, setHoveredContentType] = useState(null);

  const handleMouseEnter = (index, id, type) => {
    setHoveredIndex(index);
    setHoveredSectionIndex(id);
    setHoveredContentType(type);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHoveredContentType(null);
  };

  const handleAddSection = () => {
    setOpen(!open);
  };

  const handleAddLesson = () => {
    setOpenLessonModal(!openLessonModal);
  };

  const handleUpdateLesson = (lessonId, sectionId) => {
    setLessonId(lessonId);
    setSectionId(sectionId);
    setOpenLessonModal(true);
  };

  const handleUpdateSection = (sectionId) => {
    setSectionId(sectionId);
    setOpen(true);
  };

  const handleDeleteSection = (sectionId) => {
    try {
      SweetAlert.fire({
        title: "Are you sure?",
        text: `You want to delete this section!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await courseService.deleteSection(sectionId);
            if (res.affected) {
              queryClient.invalidateQueries(["adminCourseModules"]);
              showToast(`Successfully Delete!`);
            }
          } catch (error) {
            showToast("Failed to Delete", "error");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      SweetAlert.fire({
        title: "Are you sure?",
        text: `You want to delete this lesson!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const data = await courseService.deleteLesson(lessonId);
            if (data.statusCode === 400) {
              throw new Error("Something went wrong");
            }
            queryClient.invalidateQueries(["adminCourseModules"]);
            showToast(`Successfully Delete!`);
          } catch (error) {
            showToast("Failed to delete", "error");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!openLessonModal) {
      setLessonId(null);
      setSectionId(null);
    }
  }, [openLessonModal]);

  useEffect(() => {
    if (!open) {
      setSectionId(null);
    }
  }, [open]);

  useEffect(() => {
    if (selected) {
      setIsOpen(true);
    }
  }, [selected]);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
    }
  }, [isOpen]);

  const date = dayjs().format("DD-MM-YYYY");
  const data = { role: user.role, date };
  const encodedParams = btoa(JSON.stringify(data));

  return (
    <Box maxWidth={"600px"} margin={"20px auto auto"} autoComplete="off">
      <Box
        display={"flex"}
        gap={1}
        mb={2}
        justifyContent={"center"}
        justifyItems={"center"}
      >
        <AddSectionModal
          sectionId={sectionId}
          sectionsCurriculum={sectionsCurriculum}
          open={open}
          setOpen={setOpen}
        >
          <Button
            sx={{ width: "200px" }}
            startIcon={<IoMdAddCircle />}
            variant="outlined"
            color="primary"
            onClick={handleAddSection}
          >
            Add Section
          </Button>
        </AddSectionModal>

        <AddLessonModal
          sectionId={sectionId}
          lessonId={lessonId}
          sectionsCurriculum={sectionsCurriculum}
          open={openLessonModal}
          setOpen={setOpenLessonModal}
        >
          <Button
            sx={{ width: "200px" }}
            startIcon={<IoMdAddCircle />}
            variant="outlined"
            color="primary"
            onClick={handleAddLesson}
          >
            Add Lesson
          </Button>
        </AddLessonModal>
      </Box>
      {sectionsCurriculum?.map((item, index) => (
        <Card
          key={item.id}
          sx={{
            marginBottom: "40px",
            padding: "10px",
            backgroundColor: "#f3fcf2",
          }}
        >
          <Box
            mt={"20px"}
            sx={{
              padding: "10px 0",
              marginLeft: "10px",
              position: "relative",
              cursor: "pointer",
            }}
            onMouseEnter={() => handleMouseEnter(index, item.id, "section")}
            onMouseLeave={handleMouseLeave}
          >
            <Typography variant="h6">
              {" "}
              Section {index + 1}: {item.title}
            </Typography>
            {hoveredContentType === "section" &&
              hoveredIndex === index &&
              item.id === hoveredSectionIndex && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "5px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteSection(item.id)}
                  >
                    <MdDelete />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => handleUpdateSection(item.id)}
                  >
                    <MdEdit />
                  </IconButton>
                </Box>
              )}
          </Box>
          <Box mt={"20px"}>
            {item.lessons.map((lesson, index) => (
              <Box
                sx={{
                  marginLeft: "10px",
                  backgroundColor: "#fff",
                  position: "relative",
                }}
                display={"flex"}
                alignItems={"center"}
                gap={"4px"}
                mb={"7px"}
                key={lesson.id}
                padding={"15px"}
                className="lesson-item"
                onMouseEnter={() => handleMouseEnter(index, item.id, "lesson")}
                onMouseLeave={handleMouseLeave}
              >
                <MdPlayCircle size={16} />
                <Box fontWeight={"500"}>
                  <div role="button" style={{ cursor: "pointer" }}>
                    <Typography
                      sx={{
                        color: "#000",
                        ":hover": {
                          textDecoration: "underline",
                        },
                      }}
                      component={Link}
                      target="_blank"
                      href={`/video/${lesson.courseId}/${lesson.id}?previewKey=${encodedParams}`}
                    >
                      <span style={{ fontWeight: "400" }}>
                        {" "}
                        Lesson {index + 1}:
                      </span>{" "}
                      <span>
                        {" "}
                        {lesson.title} -{" "}
                        <span style={{ fontWeight: "600", color: "#19891c" }}>
                          {formatDuration(lesson?.durationInSecond ?? 0)}
                        </span>
                      </span>
                    </Typography>
                  </div>
                </Box>
                {hoveredContentType === "lesson" &&
                  hoveredIndex === index &&
                  item.id === hoveredSectionIndex && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: "5px",
                        display: "flex",
                        gap: "5px",
                      }}
                    >
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <MdDelete />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleUpdateLesson(lesson.id, item.id)}
                      >
                        <MdEdit />
                      </IconButton>
                    </Box>
                  )}
              </Box>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default Curriculum;
