import HeroBanner from "@/components/HeroBanner";
import ForgetPassword from "@/components/auth/ForgetPassword";
import "./page.css";

export const metadata = {
  title: "Forgot Password | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const Page = () => {
  return (
    <>
      <HeroBanner className="forget-password-header" />
      <section className="forget-password">
        <div className="container">
          <div className="content center">
            <h1>Forgot password</h1>
            <p className="text-14px">আপনার ইমেইল আইডি দিন </p>
            <ForgetPassword />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
