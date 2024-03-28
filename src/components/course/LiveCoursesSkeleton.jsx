import LinkButton from "../button/LinkButton";
import "./course-gallery.css";
import CourseItemSkeleton from "./CourseItemSkeleton";
import FeaturedCourseSkeleton from "./FeaturedCourseSkeleton";



const LiveCoursesSkeleton = async () => {
 
  return (
    <section className="skeleton section-courses ">
      <div className="section-courses-content container">
        <div className="courses-header">
          <div className="courses-header-text">
            <h2>আমাদের লাইভ কোর্সগুলি</h2>
          </div>
          <div className="courses-header-btn">
            <LinkButton
              url={
                "/courses/live?limit=10&page=1&price=all&level=all&rating=all&category=all&sort_by=newest&contentType=live"
              }
              text={"সকল কোর্স দেখুন"}
            />
          </div>
        </div>
        <FeaturedCourseSkeleton />
        <div className="skeleton-courses-grid">
        {Array.from(new Array(8)).map((d, i) => <CourseItemSkeleton key={i}></CourseItemSkeleton>)}
        </div>
        
       
      </div>
    </section>
  );
};

export default LiveCoursesSkeleton;
