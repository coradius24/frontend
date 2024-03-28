import earningService from "@/services/earningService";
import { getQueryString } from "@/utils/lib";
import { cookies } from "next/headers";
import Wallet from "./Wallet";
import "./page.css";

export const metadata = {
  title: "My Wallet | UpSpot Academy",
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
  const walletStatics = await earningService.getMyWalletReport(access_token);
  let queryString = getQueryString({
    page: searchParams.page || 1,
    limit: 10,
    startDate: searchParams.startDate || "",
    endDate: searchParams.endDate || "",
  });

  const data = await earningService.getMyEarningHistory(
    queryString,
    access_token
  );
  return (
    <>
      <Wallet walletStatics={walletStatics} data={data} />
    </>
  );
};

export default Page;
