import HeroBanner from "@/components/HeroBanner";
import ChangePassword from "@/components/auth/ChangePassword";
import { baseURL } from "@/services/api/apiService";
import { redirect } from "next/navigation";
import "./page.css";

export const metadata = {
  title: "Set Password | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const verifyToken = async (token) => {
  const res = await fetch(`${baseURL}/api/auth/verify-token`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      token_type: "passwordSet",
    }),
  });
  return res.json();
};

const Page = async ({ searchParams }) => {
  if (!searchParams.token) {
    return redirect("/");
  }

  await verifyToken(searchParams.token).then((res) => {
    if (!res.email) {
      return redirect("/");
    }
  });

  return (
    <>
      <HeroBanner className="forget-password-header" />
      <section className="forget-password">
        <div className="container">
          <div className="content center change-password">
            <h1>আপনার পাসওয়ার্ড সেট করুন!</h1>
            <p className="text-14px">
              নতুন পাসওয়ার্ড দিয়ে আপডেট বাটনে ক্লিক করুন{" "}
            </p>
            <ChangePassword type="set" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
