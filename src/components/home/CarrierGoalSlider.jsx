"use client";

import { checkLang } from "@/utils/lib";
import { useRouter } from "next/navigation";
import CustomSlider from "../CustomSlider";
const CarrierGoalSlider = ({ data = [] }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <CustomSlider
        className={"carrier-goal-slider"}
        sliderSettings={settings}
      >
        {data.map((item) => (
          <CarrierGoalItem key={item.slug} item={item} />
        ))}
      </CustomSlider>
    </>
  );
};

export default CarrierGoalSlider;

const CarrierGoalItem = ({ item = {} }) => {
  const router = useRouter();
  const { name, colorCode, icon, slug } = item;
  const handleOnclick = () => {
    router.push(
      `/courses?limit=10&page=1&price=all&level=beginner&category=${slug}&sort_by=newest`
    );
  };
  return (
    <div
      role="button"
      className="slider-item"
      title={name}
      onClick={handleOnclick}
    >
      <div className="slider-icon">
        <div className="blu-box" style={{ background: colorCode }}></div>
        <div className="icon-box" style={{ background: colorCode }}>
          <i className={icon}></i>
        </div>
      </div>
      <p className="slider-item-text" data-lang={checkLang(name)}>
        {name}
      </p>
    </div>
  );
};
