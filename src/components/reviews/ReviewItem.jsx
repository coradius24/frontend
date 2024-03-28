"use client";
import ReviewMediaAttachment from "@/app/admin/(DashboardLayout)/reviews/ReviewMediaAttachment";
import { Button } from "@mui/material";
import { useState } from "react";
import StarRating from "../StarRating";
import "./review-card.css";

const ReviewItem = ({ item = {}, isFeatured }) => {
  const [isReadMoreMode, setIsReadMoreMode] = useState(false);
  return (
    <div
      className="review-card"
      style={isFeatured ? { minHeight: "420px" } : {}}
    >
      <div className="review-item-img">
        <img
          className="review-img"
          src={item.reviewerPhoto || "/user.png"}
          alt={item.reviewerName || "reviewer photo"}
        />
        {item.attachmentType != "video" && (
          <img className="review-quote" src="/quote.svg" alt="quote image" />
        )}
      </div>
      {item.attachmentType != "video" && (
        <>
          {isFeatured ? (
            <>
              <p className="review-item-text">
               {isReadMoreMode ? item?.comment : (item?.comment?.length > (item?.image ? 35 : 239)
                  ? item?.comment?.slice(0, (item?.image ? 35 : 239)) + "..."
                  : item?.comment
                )}
                {" "}

                {item.comment?.length > (item?.image ? 35 : 230) && (
                  <>
                    <Button
                      sx={{ display: "inline" }}
                      onClick={() => setIsReadMoreMode((prev) => !prev)}
                    >
                      {" "}
                      {isReadMoreMode ? "সংক্ষিপ্ত করুন" : "আরও পড়ুন"}{" "}
                    </Button>
                  </>
                )}
              </p>
            </>
          ) : (
            <p className="review-item-text">{item.comment}</p>
          )}
        </>
      )}

      <div className="review-media">
        <ReviewMediaAttachment key={item?.id} isFeatured data={item} />
      </div>
      <div className="review-item-footer">
        <div className="review-footer-text">
          <p className="review-footer-name">{item.reviewerName || "John"}</p>
          <p className="review-footer-profession">{item.course.title}</p>
        </div>
        <div className="review-footer-rating">
          <p>কোর্স রেটিং</p>
          <StarRating filledStars={5} />
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
