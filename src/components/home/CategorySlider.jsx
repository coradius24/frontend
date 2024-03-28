"use client";

import { checkLang } from "@/utils/lib";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import Slider from "../slider/Slider";

const CategorySlider = ({ data }) => {
  const router = useRouter();
  return (
    <Slider className={"category-slider"}>
      {data.map((item) => {
        const { name, colorCode, icon, slug } = item;
        const handleOnclick = () => {
          router.push(
            `/courses?limit=10&page=1&price=all&level=beginner&category=${slug}&sort_by=newest`
          );
        };
        return (
          <SwiperSlide key={slug}>
            <div
              role="button"
              className="slider-item"
              title={name}
              onClick={handleOnclick}
            >
              <div className="slider-icon">
                <div
                  className="blu-box"
                  style={{ background: colorCode }}
                ></div>
                <div className="icon-box" style={{ background: colorCode }}>
                  <i className={icon}></i>
                </div>
              </div>
              <p className="slider-item-text" data-lang={checkLang(name)}>
                {name}
              </p>
            </div>
          </SwiperSlide>
        );
      })}
    </Slider>
  );
};

export default CategorySlider;

// "use client";
// import { checkLang } from "@/utils/lib";
// import { useRouter } from "next/navigation";
// import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// import { useRef } from "react";
// import "swiper/swiper-bundle.css";

// const CategorySlider = ({ data }) => {
//   const navigationPrevRef = useRef(null);
//   const navigationNextRef = useRef(null);
//   const router = useRouter();
//   return (
//     <Swiper
//       loop
//       modules={[Navigation, Pagination, Scrollbar, A11y]}
//       slidesPerView={1}
//       navigation={{
//         prevEl: navigationPrevRef.current,
//         nextEl: navigationNextRef.current,
//       }}
//       onBeforeInit={(swiper) => {
//         swiper.params.navigation.prevEl = navigationPrevRef.current;
//         swiper.params.navigation.nextEl = navigationNextRef.current;
//       }}
//       spaceBetween={30}
//       className="category-slider"
//       breakpoints={{
//         480: {
//           slidesPerView: 2,
//         },
//         600: {
//           slidesPerView: 2,
//         },
//         768: {
//           slidesPerView: 3,
//         },
//         1024: {
//           slidesPerView: 4,
//         },
//         1440: {
//           slidesPerView: 5,
//         },
//       }}
//     >
//       {data.map((item) => {
//         const { name, colorCode, icon, slug } = item;
//         const handleOnclick = () => {
//           router.push(
//             `/courses?limit=10&page=1&price=all&level=beginner&category=${slug}&sort_by=newest`
//           );
//         };
//         return (
//           <SwiperSlide key={slug}>
//             <div
//               role="button"
//               className="slider-item"
//               title={name}
//               onClick={handleOnclick}
//             >
//               <div className="slider-icon">
//                 <div
//                   className="blu-box"
//                   style={{ background: colorCode }}
//                 ></div>
//                 <div className="icon-box" style={{ background: colorCode }}>
//                   <i className={icon}></i>
//                 </div>
//               </div>
//               <p className="slider-item-text" data-lang={checkLang(name)}>
//                 {name}
//               </p>
//             </div>
//           </SwiperSlide>
//         );
//       })}
//       <div
//         ref={navigationPrevRef}
//         className={`slider-button-left slider-button`}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 18 18"
//           fill="none"
//         >
//           <path
//             className="slider-arrow"
//             d="M11.25 3.75L6 9L11.25 14.25"
//             strokeWidth="2"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </div>
//       <div
//         ref={navigationNextRef}
//         className={`slider-button-right slider-button`}
//       >
//         <svg
//           className="slider-arrow"
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 18 18"
//           fill="none"
//         >
//           <path
//             className="slider-arrow"
//             d="M6.75 3.75L12 9L6.75 14.25"
//             strokeWidth="2"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </div>
//     </Swiper>
//   );
// };

// export default CategorySlider;
