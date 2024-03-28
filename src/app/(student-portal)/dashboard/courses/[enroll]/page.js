import ContainerHeader from "@/components/dashboard/ContainerHeader";
import courseService from "@/services/courseService";
import enrollmentService from "@/services/enrollmentService";
import paymentService from "@/services/paymentService";
import toolsService from "@/services/toolsService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CertificateDownload from "./CertificateDownload";
import CourseNav from "./CourseNav";

const getCourseSection = async (id) => {
  try {
    return await courseService.getCourseModule(id);
  } catch (error) {
    console.log(error);
  }
};

const getCourseTools = async (id, token) => {
  return await toolsService.getMyToolsByCourseId(id, token);
};

const getWatchHistory = async (id, token) => {
  return await courseService.getWatchHistory(id, token);
};

const fetchData = async ({ id, token }) => {
  try {
    const [courseSection, tools, invoiceOfTheCourse] = await Promise.all([
      getCourseSection(id),
      getCourseTools(id, token),
      paymentService.getDueInvoiceOfACourse(id, token),
    ]);
    return { courseSection, tools, invoiceOfTheCourse };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const metadata = {
  title: "My Enroll Courses | UpSpot Academy",
  description: `আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।`,
  generator: "UpSpot Academy",
  applicationName: "UpSpot Academy",
  referrer: "origin-when-cross-origin",
  keywords: [
    "UpSpot Academy",
    "UpSpot Digital",
    "CPA Marketing",
    "Free CPA Marketing Scholarship",
    "CPA Marketing Free Class",
    "CPA Free Marketing",
  ],
  authors: [{ name: "Ashraful Islam" }],
  creator: "UpSpot Academy",
  publisher: "UpSpot Academy",
};

const Page = async ({ params }) => {
  const id = params.enroll;
  const access_token = cookies().get("access_token")?.value;
  const data = await enrollmentService.getMyEnrollments({
    token: access_token,
  });
  if (data?.length == 0) {
    return redirect("/dashboard/courses");
  }
  const isEnrolled = data.find((item) => item.course.id.toString() === id);
  if (!isEnrolled) {
    return redirect("/dashboard/courses");
  }

  let watchHistory = [];
  // if (isEnrolled.course.enableDripContent) {
  //   watchHistory = await getWatchHistory(id, access_token);
  // }

  const { courseSection, tools, invoiceOfTheCourse } = await fetchData({
    id,
    token: access_token,
  });

  return (
    <div className="enroll-course">
      <ContainerHeader title={isEnrolled.course.title}>
        {isEnrolled && <CertificateDownload courseId={id} />}
      </ContainerHeader>
      <hr />
      <CourseNav
        watchHistory={watchHistory}
        enableDripContent={false}
        courseSection={courseSection}
        courseId={id}
        tools={tools}
        invoiceOfTheCourse={invoiceOfTheCourse}
      />
    </div>
  );
};

export default Page;
