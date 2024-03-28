"use client";
import HeroBanner from "@/components/HeroBanner";
import StarRating from "@/components/StarRating";
import { checkLang } from "@/utils/lib";
import Link from "next/link";
import { AiOutlineTeam } from "react-icons/ai";
import "./courseHeader.css";

const CourseHeader = ({ course }) => {
  const { category } = course || {};
  return (
    <HeroBanner className="course-header-area">
      <div className="course-header-wrap">
        <div className="highlight-title">
          <Link
            href={"#"}
            scroll={false}
            data-lang={checkLang(category.name)}
            style={{ color: category.colorCode }}
          >
            {category.name}
          </Link>
          <div
            className="highlight"
            style={{ background: category.colorCode }}
          ></div>
        </div>
        <h1 className="title">{course.title}</h1>
        <p
          className="subtitle"
          dangerouslySetInnerHTML={{
            __html: course.shortDescription,
          }}
        />
        <div className="rating-row flex align-center">
          <StarRating filledStars={course.rating} />
          <div className="average-rating">
            <span>({course.rattedBy}</span> রিভিউ)
          </div>
          <span className="enrolled-num flex align-center">
            <div className="icon flex align-center">
              <AiOutlineTeam />{" "}
            </div>
            {course.enrollCount} মোট শিক্ষার্থী{" "}
          </span>
        </div>
      </div>
    </HeroBanner>
  );
};

export default CourseHeader;
