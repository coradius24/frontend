"use client";
import LinkButton from "@/components/button/LinkButton";
import ReviewItem from "@/components/reviews/ReviewItem";
import Slider from "@/components/slider/Slider";
import reviewService from "@/services/reviewService";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import "./featureReview.css";

const FeatureReview = () => {
  const [reviews, setReviews] = useState([]);
  const fetchReviews = () => {
    reviewService
      .getFeaturedReview({
        limit: 10,
        page: 1,
        rating: "all",
        courseId: "all",
      })
      .then((res) => {
        if (res?.results) {
          setReviews(res?.results);
        }
      });
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <section className="section-students-feedback" id="student-feedback">
        <div className="rainbow-banner">
          <div className="container">
            <div className="blur-circle blur-circle-yellow" />
            <div className="blur-circle blur-circle-green" />
            <div className="blur-circle blur-circle-purple" />
            <div className="blur-circle blur-circle-sky" />
            <div
              className={` ${
                reviews.length === 0 ? "hidden " : ""
              } students-feedback-content`}
            >
              <div className="feedback-header flex align-center">
                <h2>
                  {" "}
                  <span className="text-primary">
                    আপস্পট একাডেমি
                  </span> সম্পর্কে <br />
                  আমাদের স্টুডেন্ট কি বলে দেখুন
                </h2>
                <div className="courses-header-btn">
                  <LinkButton url={"/reviews"} text={"সকল রিভিউ দেখুন "} />
                </div>
              </div>
              <div className="feedback-slider-container">
                <Slider
                  pagination
                  className={"feedback-slider feedback-slider__home"}
                  breakpoints={{
                    480: {
                      slidesPerView: 2,
                    },
                    600: {
                      slidesPerView: 2,
                    },
                    990: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  {reviews.map((item) => (
                    <SwiperSlide key={item.id}>
                      <ReviewItem key={item.id} isFeatured item={item} />
                    </SwiperSlide>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="help-line-banner">
            <div className="flex rainbow-banner">
              <div className="blur-circle blur-circle-yellow" />
              <div className="help-line-text grid">
                <div>
                  <h3>
                    যেকোনো প্রয়োজনে আমাদের সাথে
                    <span className="text-primary"> যোগাযোগ করুন ।</span>
                  </h3>
                  <p>
                  আমরা সর্বদাই আপনাদের সাহায্য করতে প্রস্তুত। তাই আপনি কোনো সমস্যার সম্মুখীন হোন বা কোনো তথ্য অথবা সাপোর্টের প্রয়োজনবোধ করছেন, আমরা আপনার জন্য সাথে আছি।
                  </p>
                </div>

                <div className="btn-and-number">
                  <button className="btn">
                    যোগাযোগ করুন
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10.8333 5.8335L15 10.0002M15 10.0002L10.8333 14.1668M15 10.0002H5"
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="flex">
                    <img src="/Call.png" alt="call" />
                    <p>
                      <a href="tel:+8801321146224" className="text-secondary">
                        {" "}
                        +8801321 146 224
                      </a>
                      <br />
                      <a href="tel:+8801321146225" className="text-secondary">
                        {" "}
                        +8801321 146 225
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="help-line-image">
                <div className="image">
                  <img src="/help-line.png" alt="help line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureReview;
