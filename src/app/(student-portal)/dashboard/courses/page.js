import UserCourse from "@/components/course/UserCourse";
import enrollmentService from "@/services/enrollmentService";
import { cookies } from "next/headers";

export const metadata = {
  title: "My Courses | UpSpot Academy",
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

const MyCourse = async () => {
  const access_token = cookies().get("access_token")?.value;
  const data = await enrollmentService.getMyEnrollments({
    token: access_token,
  });
  return (
    <UserCourse
      recordedCourse={data.filter(
        (item) => item.course.contentType === "recorded"
      )}
      liveCourse={data.filter((item) => item.course.contentType === "live")}
    />
  );
};

export default MyCourse;
