import HeroBanner from "@/components/HeroBanner";
import { baseURL } from "@/services/api/apiService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutContainer from "./CheckoutContainer";
import "./page.css";

export const metadata = {
  title: "Checkout | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

async function getCourseDetails(id) {
  try {
    const res = await fetch(`${baseURL}/api/courses/${id}`, {
      next: {
        revalidate: 0,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return {};
  } catch (error) {
    console.log(error);
  }
}

async function getRewardCoupon(token) {
  try {
    let response = await fetch(`${baseURL}/api/coupons/my-reward-coupons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 0,
      },
    });
    response = await response.json();
    if (response.status === 400) {
      return null;
    }
    return response[0];
  } catch (error) {
    console.log(error);
  }
}

const Page = async ({ searchParams }) => {
  const access_token = cookies().get("access_token")?.value;
  if (!searchParams.data) {
    return redirect("/");
  }
  const decodedParams = atob(searchParams.data);
  const queryParams = JSON.parse(decodedParams);
  const course = await getCourseDetails(queryParams.checkoutId);
  const rewardCoupon = await getRewardCoupon(access_token);
  if (!course.id) {
    return redirect("/");
  }
  return (
    <>
      <HeroBanner className="checkout-header" />
      <section className="checkout-content">
        <CheckoutContainer course={course} rewardCoupon={rewardCoupon} />
      </section>
    </>
  );
};

export default Page;
