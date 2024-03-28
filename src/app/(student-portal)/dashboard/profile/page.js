import ContainerHeader from "@/components/dashboard/ContainerHeader";
import Profile from "./Profile";
import VerifyAccount from "./VerifyAccount";
import "./page.css";

export const metadata = {
  title: "Profile | UpSpot Academy",
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

const page = async () => {
  return (
    <div className="dashboard-profile">
      <ContainerHeader title={"আমার প্রোফাইল"}>
        <div className="content">
          <VerifyAccount />
        </div>
      </ContainerHeader>
      <hr />
      <Profile />
    </div>
  );
};

export default page;
