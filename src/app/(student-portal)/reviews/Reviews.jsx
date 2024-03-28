"use client";
import ReviewItem from "@/components/reviews/ReviewItem";
import reviewService from "@/services/reviewService";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import "./review.css";

const Reviews = () => {
  const [reviews, setReviews] = useState({});

  const getReviews = () => {
    reviewService
      .getReviews()
      .then((res) => {
        setReviews(res);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="container">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 990: 3 }}>
        <Masonry className="reviews-container">
          {reviews?.results?.map((item) => (
            <ReviewItem key={item.id} item={item} />
          ))}
          {(!reviews?.results || !reviews) && <div></div>}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Reviews;
