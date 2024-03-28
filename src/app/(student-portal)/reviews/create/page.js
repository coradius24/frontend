import HeroBanner from "@/components/HeroBanner";
import Create from "@/components/reviews/Create";
import { baseURL } from "@/services/api/apiService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Review | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

async function getCourseDetails(id) {
  try {
    const res = await fetch(`${baseURL}/api/courses/${id}`, {
      next: {
        revalidate: 0,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return {};
  } catch (error) {
    console.log(error);
  }
}

const ReviewCreate = async ({ searchParams }) => {
  const access_token = cookies().get("access_token")?.value;
  if (!searchParams.review || !access_token) {
    return redirect("/");
  }
  const decodedParams = atob(searchParams.review);
  const queryParams = JSON.parse(decodedParams);
  const course = await getCourseDetails(queryParams.courseId);
  if (!course.id) {
    return redirect("/");
  }

  return (
    <HeroBanner className="review-create">
      <div className="content">
        <Create courseId={course.id} />
      </div>
    </HeroBanner>
  );
};

export default ReviewCreate;
