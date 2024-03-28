import HeroBanner from "@/components/HeroBanner";
import FeaturedCourse from "@/components/course/FeaturedCourse";
import MainCourses from "@/components/course/MainCourses";
import Payment from "@/components/home/Payment";
import { baseURL } from "@/services/api/apiService";
import courseService from "@/services/courseService";
import { getQueryString } from "@/utils/lib";
import "./page.css";

const getCategories = async () => {
  try {
    const res = await fetch(`${baseURL}/api/categories`);
    if (res.ok) {
      return res.json();
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

async function getCourses(query) {
  try {
    return await courseService.getCourse(query);
  } catch (error) {
    console.log(error);
  }
}

const getFeaturedCourse = async () => {
  try {
    return await courseService.getFeaturedCourse("recorded");
  } catch (error) {
    console.log(error);
  }
};

const fetchData = async (query) => {
  try {
    const [featuredCourseData, coursesData, categories] = await Promise.all([
      getFeaturedCourse(),
      getCourses(query),
      getCategories(),
    ]);
    return { featuredCourseData, coursesData, categories };
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

export const metadata = {
  title: "Recorded Courses",
  description: `Upspot Academy all recorded courses`,
  generator: "UpSpot Academy",
  applicationName: "UpSpot Academy",
  keywords: [
    "UpSpot Academy",
    "UpSpot Digital",
    "CPA Marketing",
    "Free CPA Marketing Scholarship",
    "CPA Marketing Free Class",
    "CPA Free Marketing",
  ],
  authors: [{ name: "Ashraful Islam" }],
  creator: "UpSpot Academy",
  publisher: "UpSpot Academy",
};

const Page = async ({ searchParams }) => {
  let queryString = getQueryString(searchParams);
  if (queryString === "") {
    queryString =
      "limit=9&page=1&price=all&level=beginner&rating=all&category=all&sort_by=newest&contentType=recorded";
  }
  const { featuredCourseData, coursesData, categories } = await fetchData(
    queryString
  );
  return (
    <>
      <HeroBanner className="main-courses">
        <div className="content center">
          <h1>আপনার পছন্দের রেকর্ডেড কোর্সটি সিলেক্ট করুন</h1>
          <p>
            আপনার পছন্দের কোর্সটি বেছে নিন এবং নিজের স্কিলকে একধাপ এগিয়ে নিয়ে
            যান।
          </p>
        </div>
      </HeroBanner>
      {featuredCourseData?.id && (
        <section className="courses-page feature-course">
          <div className="container">
            <FeaturedCourse course={featuredCourseData || {}} />
          </div>
        </section>
      )}

      <section className="course-container">
        <MainCourses
          contentType="recorded"
          courseResult={coursesData}
          categories={categories}
        />
      </section>
      <Payment />
    </>
  );
};

export default Page;
