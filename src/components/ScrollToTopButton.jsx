"use client";
import { useEffect, useState } from "react";
import { IoChevronUpCircleOutline } from "react-icons/io5";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    isVisible &&
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
  };

  return (
    <button
      className={`position-fixed-bottom ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={scrollToTop}
    >
      <IoChevronUpCircleOutline size={25} color="#19891C" />
    </button>
  );
};

export default ScrollToTopButton;
