"use client";
import { useFetch } from "@/utils/useCustomHook";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Loading from "../Loading";
import CourseItem from "./CourseItem";

const Course = () => {
  const { data, loading } = useFetch("/api/courses?category=all");
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
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
  };

  return (
    <section className="course-carousel-area bg-gray pb-5 position-relative">
      <div className="container-lg">
        <div className="row">
          <div className="col">
            <h3 className="course-carousel-title text-center mb-4 mt-5">
              <span className="header-underline-2">Courses</span>
            </h3>
            <div className="animated-loader" style={{ display: "none" }}>
              <div className="spinner-border text-secondary" role="status" />
            </div>
            {loading ? (
              <div className="d-flex justify-content-center pt-5">
                <Loading />
              </div>
            ) : (
              <Slider
                {...settings}
                className="course-carousel shown-after-loading"
              >
                {data?.results?.map((item) => (
                  <div key={item.id} className={`slider__item-${item.id}`}>
                    <CourseItem key={item.id} course={item} />
                  </div>
                ))}
              </Slider>
            )}
          </div>
          <div className="col-12">
            <Link
              className="float-end btn btn-outline-secondary px-3 fw-600"
              href="/courses"
            >
              {" "}
              View all{" "}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Course;
