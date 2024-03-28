import HeroBanner from "@/components/HeroBanner";
import noticeboardService from "@/services/noticeboardService";
import { getQueryString } from "@/utils/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const Page = async ({ searchParams }) => {
  const access_token = cookies().get("access_token")?.value;
  let queryString = getQueryString({ page: searchParams.page || 1, limit: 4 });
  const data = await fetchData(queryString, access_token);
  if (!access_token) {
    return redirect("/");
  }
  return (
    <div className="public-notification">
      <HeroBanner className="notifications" />
      <Notifications data={data || {}} />
    </div>
  );
};

export default Page;
