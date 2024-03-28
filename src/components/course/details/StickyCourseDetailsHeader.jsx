import StarRating from "@/components/StarRating";

const StickyCourseDetailsHeader = ({ course }) => {
  return (
    <section className="course-header-area duplicated">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-lg-8">
            <div className="course-header-wrap">
              <h1 className="title">{course.title}</h1>
              <p
                className="subtitle"
                dangerouslySetInnerHTML={{ __html: course.shortDescription }}
              />

              <div className="rating-row">
                <span className="course-badge best-seller text-capitalize">
                  {course.level}
                </span>
                <StarRating filledStars={5} />
                <span className="d-inline-block average-rating"> 0</span>
                <span>(0 Ratings)</span>
                <span className="enrolled-num">
                  {course.enrollCount} Students enrolled{" "}
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </section>
  );
};

export default StickyCourseDetailsHeader;
