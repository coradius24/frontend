import HeroBanner from "@/components/HeroBanner";
import ChangePassword from "@/components/auth/ChangePassword";
import { baseURL } from "@/services/api/apiService";
import { redirect } from "next/navigation";
import "./page.css";

const verifyToken = async (token) => {
  const res = await fetch(`${baseURL}/api/auth/verify-token`, {
    cache: "no-cache",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      token_type: "passwordReset",
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
            <h1>আপনার পাসওয়ার্ড পরিবর্তন করুন!</h1>
            <p className="text-14px">
              নতুন পাসওয়ার্ড দিয়ে আপডেট বাটনে ক্লিক করুন{" "}
            </p>
            <ChangePassword />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
