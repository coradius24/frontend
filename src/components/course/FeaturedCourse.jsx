import { checkLang, formatNumber, minutesToHours } from "@/utils/lib";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../StarRating";
import CardButton from "./CardButton";
import "./feature-course.css";
const FeaturedCourse = ({ course = {}, custom = false , hideShortDescription}) => {
  const {
    id,
    title,
    discountFlag,
    price,
    discountedPrice,
    rating,
    totalLessons,
    totalLessonsInMinute,
    category,
    thumbnail,
    instructor,
    shortDescription
  } = course || { category: {} };

  return (
    <div className={`courses-card feature-course_item flex  ${hideShortDescription ? '' : ' with-description'} `}>
      <div className="courses-card-image">
        {custom ? (
          <Image
            width={302}
            height={274}
            src={thumbnail ? thumbnail : "/course-banner.jpg"}
            alt={title}
            placeholder="blur"
            blurDataURL={'data:image/webp;base64,UklGRsgCAABXRUJQVlA4WAoAAAAgAAAApQAAdwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg2gAAALALAJ0BKqYAeAA/AXS0VqslpKOhNVsZYCAJaW7dXUgCI2Pl8AJFE/UBV3KrNHPF05vBtszUJrtY34o+z52rQee9K0UTRZzqZsAO/9lvpFknfM7317vpOWVdGCT1S4qG4ZmbF6rOAAD+8F3GifD1V2yxBE3OchujgMfZ0OjZqdQJN2xpVqq1Qbye+x2FXf398Z1UiJnTV2C2RcwtveUDyoytu8DSqvbwl+xoDgYLC0Fb+0gWXpyjMUq119Znnv789v97Ke7OlgUtOTsEdMAMqTagDd2+sXLgAAAA'}
          />
        ) : (
          <Image
            width={638}
            height={384}
            src={thumbnail ? thumbnail : "/course-banner.jpg"}
            alt={title}
            placeholder="blur"
            blurDataURL={'data:image/webp;base64,UklGRsgCAABXRUJQVlA4WAoAAAAgAAAApQAAdwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg2gAAALALAJ0BKqYAeAA/AXS0VqslpKOhNVsZYCAJaW7dXUgCI2Pl8AJFE/UBV3KrNHPF05vBtszUJrtY34o+z52rQee9K0UTRZzqZsAO/9lvpFknfM7317vpOWVdGCT1S4qG4ZmbF6rOAAD+8F3GifD1V2yxBE3OchujgMfZ0OjZqdQJN2xpVqq1Qbye+x2FXf398Z1UiJnTV2C2RcwtveUDyoytu8DSqvbwl+xoDgYLC0Fb+0gWXpyjMUq119Znnv789v97Ke7OlgUtOTsEdMAMqTagDd2+sXLgAAAA'}
          />
        )}

        <div className="image-overlay">
          <div className="overlay-badge">
            <p className="overlay-badge-text">ফিচার্ড কোর্স</p>
          </div>
          <div className="overlay-profile">
            <div className="time">
              {instructor?.photo ? (
                <Image
                  src={instructor.photo}
                  alt={instructor?.fullName}
                  height={38}
                  width={38}
                />
              ) : (
                <Image
                  height={38}
                  width={38}
                  src="/user.png"
                  alt={instructor?.fullName}
                />
              )}
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
                data-lang={checkLang(category?.name)}
                style={{ color: category?.colorCode }}
              >
                {category?.name}
              </Link>
              <div
                className="highlight"
                style={{ background: category?.colorCode }}
              ></div>
            </div>
            <div className="card-rating">
              <div className="rating">
                <span className="review-count">{parseFloat(rating)}</span>
              </div>
              <div className="rating-star">
                <StarRating filledStars={rating} />
              </div>
            </div>
          </div>
          <div className="courses-card-title">
            <Link href={`/courses/${id}`}>
              <h4>{title}</h4>
            </Link>
            {hideShortDescription ||  <p style={{lineHeight: '22px', fontSize: '14px'}}>{shortDescription?.length > 500 ? shortDescription?.slice(0,500) + '...' : shortDescription}</p>}
           
          </div>
          <div className="courses-card-info">
            <div className="card-info-time">
              <div className="time">
                <Image height={16} width={16} src={"/time.svg"} alt="time" />
              </div>
              <span>{minutesToHours(totalLessonsInMinute)} ঘন্টার</span>
            </div>
            <div className="card-info-time">
              <div className="time">
                <Image height={16} width={16} src={"/lesson.svg"} alt="time" />
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

export default FeaturedCourse;
