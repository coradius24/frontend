import {
  checkLang,
  formatNumber,
  gateDiscountPercentage,
  minutesToHours,
} from "@/utils/lib";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../StarRating";
import CardButton from "./CardButton";
import "./courseItem.css";
const CourseItem = ({ course = {} }) => {
  const {
    id,
    title,
    discountFlag,
    price,
    discountedPrice,
    rating,
    totalLessons,
    totalLessonsInMinute,
    isTopCourse,
    isPopularCourse,
    category,
    thumbnail,
    instructor,
  } = course || {};

  const getCourseBadge = () => {
    if (isPopularCourse) {
      return "পপুলার কোর্স";
    } else if (isTopCourse) {
      return "টপ কোর্স";
    } else if (discountFlag) {
      return `${gateDiscountPercentage(price, discountedPrice)}% ছাড়`;
    }
  };
  const badge = getCourseBadge();
  return (
    <div className="courses-card courses-card-vertical">
      <div className="courses-card-image">
        <Image
          width={296}
          height={214}
          src={thumbnail ? thumbnail : "/course-banner.jpg"}
          alt={title}
          placeholder="blur"
          blurDataURL={
            "data:image/webp;base64,UklGRsgCAABXRUJQVlA4WAoAAAAgAAAApQAAdwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg2gAAALALAJ0BKqYAeAA/AXS0VqslpKOhNVsZYCAJaW7dXUgCI2Pl8AJFE/UBV3KrNHPF05vBtszUJrtY34o+z52rQee9K0UTRZzqZsAO/9lvpFknfM7317vpOWVdGCT1S4qG4ZmbF6rOAAD+8F3GifD1V2yxBE3OchujgMfZ0OjZqdQJN2xpVqq1Qbye+x2FXf398Z1UiJnTV2C2RcwtveUDyoytu8DSqvbwl+xoDgYLC0Fb+0gWXpyjMUq119Znnv789v97Ke7OlgUtOTsEdMAMqTagDd2+sXLgAAAA"
          }
        />
        <div className="image-overlay">
          {badge && (
            <div className="overlay-badge">
              <p className="overlay-badge-text">{badge}</p>
            </div>
          )}
          <div className="overlay-profile">
            <div className="time">
              <img
                height={28}
                width={28}
                src={instructor.photo || "/user.png"}
                alt={instructor?.fullName}
              />
            </div>
            <div className="overlay-profile-text">
              <p className="overlay-profile-name">{instructor?.fullName}</p>
              <p className="overlay-profile-position">
                {instructor?.title || "Instructor"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="courses-card-text">
        <div>
          <div className="courses-card-header">
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
            <div className="card-rating">
              <div className="rating">
                <span>{parseFloat(rating)}</span>
              </div>
              <div className="rating-star">
                <StarRating filledStars={rating} />
              </div>
            </div>
          </div>
          <div className="courses-card-title">
            <Link href={`/courses/${id}`}>
              {" "}
              <h4 data-lang={checkLang(title)}>{title}</h4>
            </Link>
          </div>
          <div className="courses-card-info">
            <div className="card-info-time">
              <div className="time">
                <img height={16} width={16} src={"/time.svg"} alt="time" />
              </div>
              <span>{minutesToHours(totalLessonsInMinute)} ঘন্টার</span>
            </div>
            <div className="card-info-time">
              <div className="time">
                <img height={16} width={16} src={"/lesson.svg"} alt="time" />
              </div>
              <span>{totalLessons} টি-লেকচার</span>
            </div>
          </div>
        </div>

        <div className="courses-card-price">
          <div className="card-price">
            {discountFlag ? (
              <>
                <span className="text-primary">
                  ৳{formatNumber(discountedPrice)}
                </span>
                <span className="line-through-price">
                  ৳&nbsp; {formatNumber(price)}
                </span>
              </>
            ) : (
              <span className="text-primary">৳{formatNumber(price)}</span>
            )}
          </div>
          <CardButton
            course={{
              id,
              title,
              discountFlag,
              price,
              discountedPrice,
              thumbnail,
            }}
            id={id}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
