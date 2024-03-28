import BackButton from "@/components/dashboard/BackButton";
import courseService from "@/services/courseService";
import enrollmentService from "@/services/enrollmentService";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Main from "./Main";
import "./page.css";

const getCourseSection = async (id) => {
  try {
    return await courseService.getCourseModule(id);
  } catch (error) {
    console.log(error);
  }
};

// const getWatchHistory = async (id, token) => {
//   return await courseService.getWatchHistory(id, token);
// };

export const metadata = {
  title: "Course | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const Page = async ({ params, searchParams }) => {
  const access_token = cookies().get("access_token")?.value;
  if (!access_token) {
    return redirect("/");
  }

  let isPreview = false;
  const previewKey = searchParams.previewKey;
  if (previewKey) {
    const date = dayjs().format("DD-MM-YYYY");
    const decodedParams = atob(previewKey);
    const keyInfo = JSON.parse(decodedParams);
    if (keyInfo?.role !== 0 && date === keyInfo?.date) {
      isPreview = true;
    }
  }

  const courseId = params.video;

  const enrolledCourses = await enrollmentService.getMyEnrollments({
    token: access_token,
  });

  if (enrolledCourses?.length == 0 && !isPreview) {
    return redirect("/");
  }
  const isEnrolled = enrolledCourses?.find(
    (item) => item.course.id.toString() === courseId
  );

  if (!isEnrolled && !isPreview) {
    return redirect("/");
  }
  // let watchHistory = [];
  // if (isEnrolled.course.enableDripContent) {
  //   watchHistory = await getWatchHistory(courseId, access_token);
  // }

  const data = await getCourseSection(params.video);
  const lessonId = parseInt(params.id);
  let allLessons = data?.map((item) => item.lessons);
  allLessons = [].concat(...allLessons);
  const currentLesson = allLessons.find((item) => item.id === lessonId);
  if (!currentLesson) {
    return redirect("/");
  }
  const currentSection = data.find(
    (element) => element.id === currentLesson.sectionId
  );

  const currentLessonIndex = allLessons.findIndex(
    (item) => item.id === lessonId
  );
  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

  return (
    <div className="video-aria">
      <div className="container">
        <BackButton />
        <Main
          data={data}
          watchHistory={[]}
          enableDripContent={false}
          currentLesson={currentLesson}
          previousLesson={previousLesson}
          allLessons={allLessons}
          courseId={courseId}
          currentSection={currentSection}
          previewKey={previewKey}
        />
      </div>
    </div>
  );
};

export default Page;
