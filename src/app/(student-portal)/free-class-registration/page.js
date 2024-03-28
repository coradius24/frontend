import HeroBanner from "@/components/HeroBanner";
import FreeClass from "@/components/free-class/FreeClass";
import Image from "next/image";
import "./page.css";
import leftImage from "/public/free-class-desktop.svg";
import rightImage from "/public/free-class-progress.svg";

export const metadata = {
  title: "Free Class Registration | UpSpot Academy",
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

const Page = () => {
  return (
    <>
      <HeroBanner className="free-class">
        <div className="content center">
          <div className="left-banner banner">
            <Image src={leftImage} alt="free class" />
          </div>
          <div className="right-banner banner">
            <Image src={rightImage} alt="free class" />
          </div>
          <h1>ফ্রীল্যান্সিং কাজ শুরু করুন বেকারত্ব দূর করুন! </h1>
          <p>
            এটি আপনার জীবনের নতুন অধ্যায় শুরুর মাধ্যমে বেকারত্ব থেকে বেরিয়ে আসতে
            সাহায্য করে এবং নির্ভরণ ও আর্থিক স্বায়ত্তশাসন অর্জন করতে সাহায্য
            করে।
          </p>
        </div>
      </HeroBanner>
      <FreeClass />
    </>
  );
};

export default Page;
