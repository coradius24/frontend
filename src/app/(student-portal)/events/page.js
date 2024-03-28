import HeroBanner from "@/components/HeroBanner";
import Payment from "@/components/home/Payment";
import galleryService from "@/services/galleryService";
import Events from "./Events";
import "./page.css";

export const metadata = {
  title: `All Events - UpSpot Digital`,
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

const Event = async ({ searchParams }) => {
  let query = {
    page: searchParams.page || 1,
    limit: searchParams.limit || 16,
  };
  const data = await galleryService.getGalleries(query);
  return (
    <>
      <HeroBanner className="event-header">
        <div className="content center">
          <h1>অফিসিয়াল ইভেন্ট ছবির গ্যালারি</h1>
          <p>প্রতিষ্ঠানে সকল স্টাফদের সাথে ইভেন্টের ছবির গ্যালারি দেখুন </p>
        </div>
      </HeroBanner>
      <div className="container">
        <Events data={data} />
      </div>
      <Payment />
    </>
  );
};

export default Event;
