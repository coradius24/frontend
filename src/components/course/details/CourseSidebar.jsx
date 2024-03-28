"use client";
import VideoModal from "@/components/VideoModal";
import SidebarAdd from "@/components/add-banner/SidebarAdd";
import { Button } from "@/components/button/LinkButton";
import LoadingButton from "@/components/button/LoadingButton";
import useApp from "@/hooks/useApp";
import { formatNumber, showToast } from "@/utils/lib";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineCheckCircle, HiOutlineShare } from "react-icons/hi";
import "./courseSidebar.css";

function getYouTubeVideoId(url) {
  const watchRegex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(watchRegex);

  if (match && match[1]) {
    return match[1];
  }
  return null;
}

const CourseCard = ({ course }) => {
  const {
    discountFlag,
    price,
    discountedPrice,
    thumbnail,
    id,
    title,
    contentType,
    enrollmentDeadline,
    whatsIn,
    videoUrl,
  } = course;

  const { cart, addToCart, setCart } = useApp();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data } = useSession();
  let isActiveEnrollment = true;
  if (contentType === "live") {
    if (!enrollmentDeadline) {
      isActiveEnrollment = false;
    }
  }
  const onClickHandler = () => {
    if (!isActiveEnrollment) {
      return;
    }
    setLoading(true);
    if (!data) {
      return router.push(`/login?callbackUrl=${pathname}`);
    }
    addToCart({
      id,
      title,
      discountFlag,
      price,
      discountedPrice,
      thumbnail,
    });
  };

  const handleAddToCart = () => {
    if (!isActiveEnrollment) {
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart"));
    if (existingCart && existingCart.some((item) => item.id === course.id)) {
      return showToast("Already exist in cart!", "error");
    }
    const updatedCart = [
      ...cart,
      {
        id,
        title,
        discountFlag,
        price,
        discountedPrice,
        thumbnail,
      },
    ];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    return showToast("Successfully Added!");
  };

  let youtubeID = "";
  if (videoUrl) {
    youtubeID = getYouTubeVideoId(videoUrl);
  }

  return (
    <div className="">
      <div className={`course-sidebar natural`}>
        <div className="preview-video-box">
          <Image
            src={thumbnail ? thumbnail : "/course-d.png"}
            alt="course banner"
            className="w-100"
            width={507}
            height={351}
          />
          {videoUrl && youtubeID && (
            <VideoModal provider="youtube" autoplay={false} videoId={youtubeID}>
              <span className="play-icon-container">
                <PlayCircleOutlineIcon fontSize="large" className="play-icon" />
              </span>
            </VideoModal>
          )}
        </div>
        <div className="course-sidebar-text-box">
          {whatsIn && (
            <div className="top flex">
              <h3>এই কোর্সে আপনি যা যা পাচ্ছেন</h3>
              <button type="button" className="flex">
                {" "}
                <span>
                  {" "}
                  <HiOutlineShare size={13} />
                </span>{" "}
                শেয়ার করুন{" "}
              </button>
            </div>
          )}
          <hr />
          <div className="course-facilities">
            <ul className="flex">
              {whatsIn &&
                whatsIn.map((item, index) => (
                  <li key={`${item}__${index}`}>
                    <HiOutlineCheckCircle className="text-primary" />
                    {item}
                  </li>
                ))}
            </ul>
          </div>
          <div className="price flex">
            <p>কোর্সের মূল্য</p>
            <div>
              {discountFlag ? (
                <>
                  <span className="current-price">
                    ৳{formatNumber(discountedPrice)}
                  </span>
                  <span className="line-through-price">
                    ৳&nbsp; {formatNumber(price)}
                  </span>
                </>
              ) : (
                <span className="current-price">৳ {price}</span>
              )}
            </div>
          </div>
          <div className="buy-btns">
            {loading ? (
              <LoadingButton className={"full-width"} />
            ) : (
              <Button
                disabled={!isActiveEnrollment}
                onClick={() =>
                  onClickHandler({
                    id,
                    amount: discountFlag ? discountedPrice : price,
                  })
                }
                className="full-width"
                text={"কোর্সটি কিনুন"}
              />
            )}
            <Button
              disabled={!isActiveEnrollment}
              onClick={handleAddToCart}
              className="full-width"
              text={"কার্টে যুক্ত করুন"}
            />
          </div>
        </div>
      </div>
      <div className="payment-method">
        <h3>আপনি যে ব্যাংকগুলি দ্বারা পেমেন্ট করতে পারবেন। </h3>
        <Image
          src={"/payment-method.png"}
          height={100}
          width={400}
          alt="payment method"
        />
      </div>
      <div className="sidebar-add">
        <div className="sidebar-add-top">
          <SidebarAdd />
        </div>
        <div className="sidebar-add-bottom small-hide medium-hide">
          <img src="/new-add-banner.png" alt="course banner" width={"100%"} />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
