"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import categoryService from "@/services/categoryService";
import courseService from "@/services/courseService";
import userService from "@/services/userService";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "next-usequerystate";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Assignment from "./Assignment";
import CourseBasic from "./CourseBasic";
import CourseInfo from "./CourseInfo";
import CourseMedia from "./CourseMedia";
import CoursePricing from "./CoursePricing";
import CourseSeo from "./CourseSeo";
import Curriculum from "./Curriculum";
import Zoom from "./Zoom";

const BCrumb = [
  {
    to: "/admin/courses",
    title: "Courses",
  },
  {
    title: "Course Details",
  },
];

export default function BasicTabs() {
  const [type, setType] = useQueryState("type");
  const params = useParams();
  const router = useRouter();
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [file, setFile] = useState(null);

  const { data } = useQuery({
    queryKey: ["adminCourseCategories"],
    queryFn: () => categoryService.getCateGory(),
  });

  const { data: sectionsCurriculum } = useQuery({
    queryKey: ["adminCourseModules", params.id],
    queryFn: () => courseService.getCourseModule(params.id),
  });

  const { data: courseDetailsData } = useQuery({
    queryKey: ["adminCourseDetails", params.id],
    queryFn: () => courseService.getCourseDetails(params.id),
  });

  const { data: instructorData } = useQuery({
    queryKey: ["adminInstructor"],
    queryFn: () => userService.getInstructors(),
  });
  let content = null;
  console.log("courseDetailsData", { courseDetailsData });
  if (type === "curriculum") {
    content = <Curriculum sectionsCurriculum={sectionsCurriculum} />;
  } else if (type === "basic") {
    content = <CourseBasic courseDetailsData={courseDetailsData} data={data} />;
  } else if (type === "info") {
    content = <CourseInfo courseDetailsData={courseDetailsData} />;
  } else if (type === "pricing") {
    content = <CoursePricing courseDetailsData={courseDetailsData} />;
  } else if (type === "seo") {
    content = <CourseSeo courseDetailsData={courseDetailsData} />;
  } else if (type === "zoom") {
    content = <Zoom courseDetailsData={courseDetailsData} />;
  } else if (type === "assignment") {
    content = <Assignment />;
  } else if (type === "media") {
    content = (
      <CourseMedia
        courseDetailsData={courseDetailsData}
        instructorData={instructorData}
      />
    );
  }

  return (
    <PageContainer
      title={`Course Details - ${courseDetailsData?.title} - ${
        courseDetailsData?.batchTitle || "Main"
      } `}
      description="Course Details also course edit"
    >
      <Breadcrumb
        title={`${courseDetailsData?.title} - ${
          courseDetailsData?.batchTitle || "Main"
        } `}
        items={BCrumb}
      />
      <Box sx={{ width: "100%" }}>{content}</Box>
    </PageContainer>
  );
}
