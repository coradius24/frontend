import { checkLang } from "@/utils/lib";
import Image from "next/image";
import Link from "next/link";
import "./courseItem.css";

function EnrolledCourseCard({ course }) {
  const { id, title, category, thumbnail, instructor, batchTitle } =
    course || {};
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
          <div className="overlay-profile">
            <div className="time">
              <img
                src={instructor.photo || "/user.png"}
                alt={instructor?.fullName}
                height={38}
                width={38}
              />
            </div>
            <div className="overlay-profile-text">
              <p className="overlay-profile-name">{instructor.fullName}</p>
              <p className="overlay-profile-position">
                {instructor.title || "Instructor"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="courses-card-text">
        <div>
          <div className="courses-card-header">
            <div className="highlight-title">
              <span
                data-lang={checkLang(category.name)}
                style={{ color: category.colorCode }}
              >
                {category.name}
              </span>
              <div
                className="highlight"
                style={{ background: category.colorCode }}
              ></div>
            </div>
            <div className="card-rating">
              <div className="rating">
                {/* <span>{parseFloat(rating)}</span> */}
              </div>
            </div>
          </div>
          <div className="courses-card-title">
            {" "}
            <h4>
              {title} {batchTitle ? `- ${batchTitle}` : ""}
            </h4>
          </div>
        </div>
        <div className="courses-card-price">
          <Link
            className="card-btn full-width"
            href={`/dashboard/courses/${id}`}
          >
            কোর্সটি শুরু করুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnrolledCourseCard;
