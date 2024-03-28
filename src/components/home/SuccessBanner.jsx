"use client";
import Link from "next/link";
import CountUp from "react-countup";
import "./success-banner.css";

const SuccessBanner = () => {
  return (
    <section className="section-institute-success">
      <div className="container">
        <div className="institute-success-content flex">
          <div className="content-text">
            <p className="title">আমাদের ইনস্টিটিউটের সাফল্যগুলি দেখুন</p>
            <p>
              আমাদের সাকসেস স্টোরিতে আপনার নাম লেখাতে চান ? তাহলে ফ্রি ক্লাসে
              জয়েন করতে এখানে       {" "}
              <Link href={"free-class-registration"} className="underline font-weight-500">
                রেজিষ্ট্রেশন করুন।
              </Link>
            </p>
          </div>
          <div className="content-count flex">
            <div className="count">
              <p className="point text-primary">
                <CountUp start={0} delay={1} end={30000} suffix="+" />
              </p>
              <p>মোট শিক্ষার্থী</p>
            </div>
            <div className="count">
              <p className="point text-primary"><CountUp start={0} delay={1} end={90} suffix="%" /></p>
              <p>কমপ্লিশন রেট</p>
            </div>
            <div className="count">
              <p className="point text-primary"><CountUp start={0} delay={1} end={15} suffix="+" /></p>
              <p>অভিজ্ঞ মেন্টর</p>
            </div>
            <div className="count">
              <p className="point text-primary"><CountUp start={0} delay={1} end={500} suffix="+" /></p>
              <p>লার্নিং ম্যাটেরিয়াল</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessBanner;
