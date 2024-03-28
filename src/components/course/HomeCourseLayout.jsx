"use client";
import { useMediaQuery } from "@/utils/useCustomHook";
import CustomSlider from "../CustomSlider";
import CourseItem from "./CourseItem";

const HomeCourseLayout = ({ courses, className = "", type }) => {
  let data = courses;
  const isDesktop = useMediaQuery("(min-width: 990px)");
  if (type === "recorded" && isDesktop) {
    data = courses.slice(2);
  }
  return (
    <>
      <div
        className={`${className} courses-card-items small-hide medium-hide corses-card-items-vertical`}
      >
        {data?.length > 0 &&
          data.map((item) => <CourseItem course={item} key={item.id} />)}
      </div>
      <div className="courses-card-items large-up-hide courses-card-items_slider corses-card-items-vertical">
        <CustomSlider
          className={""}
          sliderSettings={{
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 990,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ],
          }}
        >
          {data?.map((item) => (
            <CourseItem key={item.id} course={item} />
          ))}
        </CustomSlider>
      </div>
    </>
  );
};

export default HomeCourseLayout;
