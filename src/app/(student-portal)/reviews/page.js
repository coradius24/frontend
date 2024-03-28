import HeroBanner from "@/components/HeroBanner";
import Reviews from "./Reviews";
import "./review.css";

export const metadata = {
  title: "Student Reviews | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const ReviewPage = () => {
  return (
    <main className="main__review">
      <HeroBanner className="main-courses">
        <div className="content center">
          <h1>আপস্পট একাডেমি সম্পর্কে শিক্ষার্থীরা কি বলে দেখুন </h1>
          <p>
            আপনার পছন্দের রেকর্ডেড কোর্সটি বেছে নিন এবং নিজের স্কিলকে একধাপ
            এগিয়ে নিয়ে যান।{" "}
          </p>
        </div>
      </HeroBanner>
      <Reviews />
    </main>
  );
};

export default ReviewPage;
