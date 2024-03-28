import HeroBanner from "@/components/HeroBanner";
import LinkButton from "@/components/button/LinkButton";
import paymentService from "@/services/paymentService";
import { checkLang } from "@/utils/lib";
import { HiBadgeCheck } from "react-icons/hi";
import { MdError } from "react-icons/md";
import "./page.css";

export const metadata = {
  title: "Payment Message | UpSpot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const Page = async ({ searchParams }) => {
  const { order_id } = searchParams;
  const response = await paymentService.verifyPayment(order_id);
  return (
    <>
      <HeroBanner className="course-payment" />
      <section className="course-payment-content">
        <div className="container">
          <div className="bg">
            <div className="content center">
              <div className="icon">
                {response?.success ? (
                  <HiBadgeCheck color="#4FB354" size={100} />
                ) : (
                  <MdError color="#F30404" size={100} />
                )}
              </div>
              {response.success ? (
                <h1 data-lang={checkLang(response?.enrollmentStatus)}>
                  {response?.enrollmentStatus}
                </h1>
              ) : (
                <h1 data-lang={checkLang(response?.error)}>
                  {response?.error}
                </h1>
              )}

              <p>
                {response?.success
                  ? "Congratulations! You have successfully enrolled in the course. Get ready to start your learning journey!"
                  : "কিছু সমস্যা হয়েছে! আপনার পেমেন্ট প্রক্রিয়া সম্পন্ন হয়নি। দয়া করে আবার চেষ্টা করুন এবং যদি সমস্যা থাকে, তাহলে আমাদের সাথে যোগাযোগ করুন।"}
              </p>
              {response?.success ? (
                <div className="button-group">
                  <LinkButton
                    url={"/dashboard/purchase-history"}
                    text={"পার্চেস হিস্ট্রি"}
                  />
                  <LinkButton url={"/dashboard/courses"} text={"আমার কোর্স "} />
                </div>
              ) : (
                <>
                  <div className="contact-info">
                    <div className="phone">
                      <span>
                        <a href="tel:+8801321146224">+8801321 146 224</a>
                      </span>
                      <span>
                        <a href="tel:+8801321146225">+8801321 146 225</a>
                      </span>
                    </div>
                    <a className="email" href="mailto:info@upspotacademy.com">
                      info@upspotacademy.com
                    </a>
                  </div>
                  <div className="button-group">
                    <LinkButton url={"/"} text={"হোমে যান"} />
                    <LinkButton
                      url={"/dashboard/courses"}
                      text={"আমার কোর্স "}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
