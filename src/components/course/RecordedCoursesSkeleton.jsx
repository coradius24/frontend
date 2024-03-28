import LinkButton from "../button/LinkButton";
import "./course-gallery.css";
import CourseItemSkeleton from "./CourseItemSkeleton";
import FeaturedCourseSkeleton from "./FeaturedCourseSkeleton";



const RecordedCoursesSkeleton = async () => {

  return (
    <section className="skeleton recorded section-courses ">
      <div className="section-courses-content container">
        <div className="courses-header">
          <div className="courses-header-text">
            <h2>আমাদের রেকর্ডেড কোর্সগুলি</h2>
          </div>
          <div className="courses-header-btn">
            <LinkButton
              url={
                "/courses/recorded?limit=10&page=1&price=all&level=all&rating=all&category=all&sort_by=newest&contentType=recorded"
              }
              text={"সকল কোর্স দেখুন"}
            />
          </div>
        </div>
        <FeaturedCourseSkeleton />

        <div className="skeleton-featured-courses-grid">
          <FeaturedCourseSkeleton
            hideShortDescription
            custom
          />
          <FeaturedCourseSkeleton
              hideShortDescription
              custom
          />
        </div>
       
        <div className="skeleton-courses-grid">
          {Array.from(new Array(4)).map((d, i) => <CourseItemSkeleton key={i}></CourseItemSkeleton>)}
        </div>


      </div>
    </section>
  );
};

export default RecordedCoursesSkeleton;
