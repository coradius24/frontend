"use client";
import {
  A11y,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { Swiper } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./slider.css";

const defaultBreakPoints = {
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
  1440: {
    slidesPerView: 5,
  },
};

import { useSwiper } from "swiper/react";

const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div
      onClick={() => swiper.slidePrev()}
      className={`slider-button-left slider-button`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          className="slider-arrow"
          d="M11.25 3.75L6 9L11.25 14.25"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const SlidePrevButton = () => {
  const swiper = useSwiper();
  return (
    <div
      onClick={() => swiper.slideNext()}
      className={`slider-button-right slider-button`}
    >
      <svg
        className="slider-arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          className="slider-arrow"
          d="M6.75 3.75L12 9L6.75 14.25"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Slider = ({
  children,
  className,
  pagination = false,
  breakpoints = defaultBreakPoints,
}) => {
  return (
    <>
      <Swiper
        loop
        pagination={{
          clickable: true,
          enabled: pagination,
          bulletClass: "swiper-custom-bullet",
          bulletActiveClass: "swiper-custom-bullet-active",
        }}
        modules={[FreeMode, Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        navigation={{ enabled: !pagination }}
        spaceBetween={30}
        className={className || ""}
        breakpoints={breakpoints}
      >
        {children}
        {!pagination && (
          <>
            <SlideNextButton />
            <SlidePrevButton />
          </>
        )}
      </Swiper>
    </>
  );
};

export default Slider;
