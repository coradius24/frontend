import Blog from "@/components/blog/Blog";
import BlogSkeleton from "@/components/blog/BlogSkeleton";
import LiveCourses from "@/components/course/LiveCourses";
import LiveCoursesSkeleton from "@/components/course/LiveCoursesSkeleton";
import RecordedCourses from "@/components/course/RecordedCourses";
import RecordedCoursesSkeleton from "@/components/course/RecordedCoursesSkeleton";
import CarrierGoal from "@/components/home/CarrierGoal";
import CourseBanner from "@/components/home/CourseBanner";
import Facilities from "@/components/home/Facilities";
import Hero from "@/components/home/Hero";
import Payment from "@/components/home/Payment";
import SuccessBanner from "@/components/home/SuccessBanner";
import Event from "@/components/home/event/Event";
import FeatureReview from "@/components/home/reviews/FeatureReview";
import Instructor from "@/components/instructor/Instructor";
import InstructorSkeleton from "@/components/instructor/InstructorSkeleton";
import { Suspense } from "react";

export const metadata = {
  title: "Home || Upspot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
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

export default async function Home() {
  return (
    <>
      <Hero />
      <SuccessBanner />
      <CarrierGoal />
      <CourseBanner title="প্রফেশনাল ফ্রি সিপিএ মার্কেটিং" />
      <Suspense fallback={<LiveCoursesSkeleton />}>
        <LiveCourses />
      </Suspense>
      <Facilities />
      <Suspense fallback={<RecordedCoursesSkeleton />}>
        <RecordedCourses />
      </Suspense>
      <FeatureReview />
      <Suspense fallback={<InstructorSkeleton />}>
        <Instructor />
      </Suspense>
      <Event />
      <Suspense fallback={<BlogSkeleton isHome />}>
        <Blog className="blog-home" isHome />
      </Suspense>
      <CourseBanner title="প্রফেশনাল ডাটা এন্ট্রি" />
      <Payment />
    </>
  );
}
