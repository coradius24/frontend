"use client";
import { SwiperSlide } from "swiper/react";
import Slider from "../slider/Slider";
import InstructorItem from "./InstructorItem";

const InstructorSlider = ({ data = [] }) => {
  return (
    <Slider
      className={"instructor-slider"}
      breakpoints={{
        480: {
          slidesPerView: 2,
        },
        600: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      {data.map((item) => (
        <SwiperSlide key={item.id}>
          <InstructorItem data={item} />
        </SwiperSlide>
      ))}
    </Slider>
  );
};

export default InstructorSlider;
