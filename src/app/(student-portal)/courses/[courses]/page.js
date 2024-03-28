import CourseDetails from "@/components/course/details/CourseDetails";
import CourseHeader from "@/components/course/details/CourseHeader";
import CourseBanner from "@/components/home/CourseBanner";
import Payment from "@/components/home/Payment";
import { baseURL } from "@/services/api/apiService";
import { redirect } from "next/navigation";

async function getCourseDetails(id) {
  try {
    const res = await fetch(`${baseURL}/api/courses/${id}`, {
      next: {
        revalidate: 60,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return {};
  } catch (error) {}
}

async function getCourseSection(id) {
  try {
    const res = await fetch(`${baseURL}/api/courses/sections/${id}`, {
      next: {
        revalidate: 1200,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return {};
  } catch (error) {}
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.courses;
  const course = await fetch(`${baseURL}/api/courses/${id}`).then((res) =>
    res.json()
  );

  return {
    title: course.title,
    keywords: course.metaKeywords,
    description: course.metaDescription,
    generator: "UpSpot Academy",
    applicationName: "UpSpot Academy",
    authors: [{ name: "Ashraful Islam" }],
    creator: "UpSpot Academy",
    publisher: "UpSpot Academy",
  };
}

const Page = async ({ params }) => {
  const id = params.courses;
  const data = await getCourseDetails(id);
  if (!data.id) {
    return redirect("/");
  }
  const courseSection = await getCourseSection(id);
  return (
    <>
      <CourseHeader course={data} />
      <CourseDetails course={data} courseSection={courseSection} />
      <CourseBanner />
      <Payment />
    </>
  );
};

export default Page;
