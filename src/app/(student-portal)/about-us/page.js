import CourseBanner from "@/components/home/CourseBanner";
import Payment from "@/components/home/Payment";
import AboutHero from "./AboutHero";
import Statics from "./Statics";
import TeamMembers from "./TeamMembers";

export const metadata = {
  title: "About Us | UpSpot Academy",
  description: `আপস্পট একাডেমি এমন একটি প্রতিষ্ঠান, যেখানে ফ্রীল্যান্সিং কোর্স শিক্ষার একটি উন্নত মান দেয় এবং সম্প্রদায়কে ক্ষমতায়ন করে। এই প্রতিষ্ঠানের মাধ্যমে ছাত্র-ছাত্রীদের মাধ্যমে ফ্রীল্যান্সিং এর দুনিয়ায় প্রবেশ করানো হয় এবং তাদের ক্ষমতা এবং কার্যকরিতা বৃদ্ধি করা হয়। এই প্রতিষ্ঠানে শিক্ষক এবং উপাধ্যায়দের নির্দেশনা অনুসরণ করে ছাত্র-ছাত্রীদেরকে কাজের প্রাথমিক ধারণা দেয়া হয় এবং তাদেরকে বিভিন্ন ফ্রিল্যান্সিং প্ল্যাটফর্মে দক্ষ করে তোলা হয়।
    `,
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
      <AboutHero />
      <CourseBanner />
      <Statics />
      <TeamMembers />
      <CourseBanner />
      <Payment />
    </>
  );
};

export default Page;
