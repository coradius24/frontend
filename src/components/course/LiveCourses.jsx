import courseService from "@/services/courseService";
import LinkButton from "../button/LinkButton";
import FeaturedCourse from "./FeaturedCourse";
import HomeCourseLayout from "./HomeCourseLayout";
import "./course-gallery.css";

const getFeaturedCourse = async () => {
  try {
    return await courseService.getFeaturedCourse("live");
  } catch (error) {
    console.log(error);
  }
};

const getCourses = async () => {
  return await courseService.getCourse(
    `limit=8&page=1&price=all&level=all&rating=all&category=all&sort_by=newest&contentType=live`
  );
};

const fetchData = async () => {
  try {
    const [featuredCourseData, coursesData] = await Promise.all([
      getFeaturedCourse(),
      getCourses(),
    ]);
    return { featuredCourseData, coursesData };
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

const LiveCourses = async () => {
  const { featuredCourseData, coursesData } = await fetchData();
  const { results = [] } = coursesData;
  if (results?.length === 0) return null;
  return (
    <section className="section-courses">
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
        {featuredCourseData?.id && (
          <FeaturedCourse course={featuredCourseData || {}} />
        )}
        {coursesData?.totalCount !== 0 && (
          <HomeCourseLayout courses={coursesData?.results} />
        )}
      </div>
    </section>
  );
};

export default LiveCourses;
