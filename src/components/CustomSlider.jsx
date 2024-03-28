"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
const CustomSlider = ({
  data = [],
  children,
  sliderSettings = {},
  className,
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
    ...sliderSettings,
  };
  return (
    <>
      <Slider {...settings} className={className}>
        {children}
      </Slider>
    </>
  );
};

export default CustomSlider;
export const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div onClick={onClick} className={`slider-button-left slider-button`}>
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
export const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div onClick={onClick} className={`slider-button-right slider-button`}>
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
