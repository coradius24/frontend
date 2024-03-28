import courseService from "@/services/courseService";
import LinkButton from "../button/LinkButton";
import FeaturedCourse from "./FeaturedCourse";
import HomeCourseLayout from "./HomeCourseLayout";
import "./course-gallery.css";
import "./recorded.css";

const getFeaturedCourse = async () => {
  try {
    return await courseService.getFeaturedCourse("recorded");
  } catch (error) {
    console.log(error);
  }
};

const getCourses = async () => {
  return await courseService.getCourse(
    `limit=6&page=1&price=all&level=all&rating=all&category=all&sort_by=newest&contentType=recorded`
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

const RecordedCourses = async () => {
  const { featuredCourseData, coursesData } = await fetchData();
  const { results = [] } = coursesData;

  if (results?.length === 0) return null;
  return (
    <section className="section-courses section-courses-recorded">
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
        {featuredCourseData?.id && (
          <FeaturedCourse course={featuredCourseData || {}} />
        )}
        {results?.length > 0 && (
          <>
            <div className="top-row small-hide medium-hide">
              <FeaturedCourse
                hideShortDescription
                custom
                course={results[0] || {}}
              />
              {results[1] && (
                <FeaturedCourse
                  hideShortDescription
                  custom
                  course={results[1] || {}}
                />
              )}
            </div>
            <HomeCourseLayout
              type={"recorded"}
              className="recorded-courses"
              courses={results}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default RecordedCourses;
