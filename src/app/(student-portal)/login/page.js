import HeroBanner from "@/components/HeroBanner";
import Login from "@/components/auth/Login";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import "./page.css";

export const metadata = {
  title: "Login || Upspot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard/notices");
  return (
    <HeroBanner className="login auth">
      <div className="content flex">
        <div className="banner small-hide medium-hide">
          <Image width={656} height={576} alt="login" src={"/login.svg"} />
        </div>
        <div className="login-form">
          <div className="logo center">
            <Image src={"/auth.png"} width={155} height={55} alt="up spot" />
          </div>
          <div className="center">
            <h1>দক্ষতার যাত্রায় আপনাকে স্বাগতম!</h1>
            <p className="login-divider">আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন। </p>
          </div>
          {/* <Oauth /> */}
          {/* <p className="login-divider">অথবা ইমেইল দিয়ে লগইন করুন</p> */}
          <Login />
        </div>
      </div>
    </HeroBanner>
  );
};

export default Page;
