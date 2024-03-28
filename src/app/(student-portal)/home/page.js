import Blog from "@/components/blog/Blog";
import CourseGallery from "@/components/course/LiveCourses";
import CarrierGoal from "@/components/home/CarrierGoal";
import CourseBanner from "@/components/home/CourseBanner";
import Facilities from "@/components/home/Facilities";
import Hero from "@/components/home/Hero";
import Payment from "@/components/home/Payment";
import SuccessBanner from "@/components/home/SuccessBanner";
import Event from "@/components/home/event/Event";
import FeatureReview from "@/components/home/reviews/FeatureReview";
import Instructor from "@/components/instructor/Instructor";

const Home = () => {
  return (
    <>
      <Hero />
      <SuccessBanner />
      <CarrierGoal />
      <CourseBanner />
      <CourseGallery />
      <Facilities />
      <FeatureReview />
      <Instructor />
      <Event />
      <Blog />
      <Payment />
    </>
  );
};

export default Home;
