"use client";
import ReviewItem from "@/components/reviews/ReviewItem";
import Slider from "@/components/slider/Slider";
import reviewService from "@/services/reviewService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import "./review.css";

const Review = () => {
  const params = useParams();
  const [reviews, setReviews] = useState([]);

  const fetchReviews = () => {
    reviewService
      .getFeaturedReview({
        limit: 10,
        page: 1,
        rating: "all",
        courseId: params.courses,
      })
      .then((res) => {
        if (res?.results) {
          setReviews(res?.results);
        }
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [params.courses]);

  return (
    <>
      <div className="container">
        <div className="header center">
          <h2>এই কোর্সটি সম্পর্কে আমাদের স্টুডেন্ট কি বলে দেখুন</h2>
          <p>
            আপনার জন্য প্রয়োজনীয় পছন্দের কোর্সটি এখানে রয়েছে। নিচের অপশন গুলো
            থেকে আপনার পছন্দের কোর্সটি সিলেক্ট করে
          </p>
        </div>
        <div className="students-feedback-content">
          <div className="feedback-slider-container">
            <Slider
              pagination
              className={"feedback-slider feedback-slider__course-details"}
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
                  <ReviewItem key={item.id}  item={item} />
                </SwiperSlide>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
