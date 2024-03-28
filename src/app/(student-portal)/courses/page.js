import HeroBanner from "@/components/HeroBanner";
import FeaturedCourse from "@/components/course/FeaturedCourse";
import MainCourses from "@/components/course/MainCourses";
import Payment from "@/components/home/Payment";
import { baseURL } from "@/services/api/apiService";
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
    const res = await fetch(`${baseURL}/api/courses?${query}`);
    if (res.ok) {
      return res.json();
    }
    return {};
  } catch (error) {
    console.log(error);
  }
}

const getFeaturedCourse = async () => {
  const res = await fetch(`${baseURL}/api/courses/featured`);
  if (res.ok) {
    return res.json();
  }
  return {};
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
  title: "Courses || Upspot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
};

const Page = async ({ searchParams }) => {
  let queryString = getQueryString(searchParams);
  if (queryString === "") {
    queryString =
      "limit=9&page=1&price=all&level=beginner&rating=all&category=all&sort_by=newest";
  }
  const { featuredCourseData, coursesData, categories } = await fetchData(
    queryString
  );

  return (
    <>
      <HeroBanner className="main-courses">
        <div className="content center">
          <h1>আপনার পছন্দের কোর্সটি সিলেক্ট করুন </h1>
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
        <MainCourses courseResult={coursesData} categories={categories} />
      </section>
      <Payment />
    </>
  );
};

export default Page;
