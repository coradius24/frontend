import noticeboardService from "@/services/noticeboardService";
import { getQueryString } from "@/utils/lib";
import { cookies } from "next/headers";
import Notifications from "./Notifications";
import "./page.css";

const fetchData = async (filter, token) => {
  try {
    const res = await noticeboardService.getNotices(filter, token);
    return res;
  } catch (error) {
    console.log(error, "error");
  }
};

export const metadata = {
  title: "Notices | UpSpot Academy",
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

const Page = async ({ searchParams }) => {
  const access_token = cookies().get("access_token")?.value;
  let queryString = getQueryString({ page: searchParams.page || 1, limit: 4 });
  const data = await fetchData(queryString, access_token);
  return (
    <div className="dashboard-notification">
      <Notifications data={data} />
    </div>
  );
};

export default Page;
