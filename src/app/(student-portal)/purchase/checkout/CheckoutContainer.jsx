"use client";
import defaultCourseImage from "@/../public/course-banner.jpg";
import paymentOption from "@/../public/payment-options.png";
import { Button } from "@/components/button/LinkButton";
import LoadingButton from "@/components/button/LoadingButton";
import paymentService from "@/services/paymentService";
import { formatNumber, showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Coupon from "./Coupon";

const CheckoutContainer = ({ course = {}, rewardCoupon = "" }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [data, setData] = useState(() => {
    return {
      title: course.title,
      price: course.discountFlag ? course.discountedPrice : course.price,
      discountPrice: course.discountFlag
        ? course.discountedPrice
        : course.price,
      discount: 0,
      coupon: rewardCoupon,
      thumbnail: course.thumbnail,
      id: course.id,
    };
  });

  const handlePayment = async () => {
    try {
      startLoading();
      const res = await paymentService.createPayment({
        courseId: data.id,
        amount: data.discountPrice,
        couponApplied: data.coupon,
      });
      if (res.error) {
        showToast(res.message, "error");
        stopLoading();
      } else {
        const existingCart = JSON.parse(localStorage.getItem("cart"));
        const updateCart = existingCart.filter((item) => item.id !== data.id);
        localStorage.setItem("cart", JSON.stringify(updateCart));
        window.location.assign(res.checkout_url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setData({
      title: course.title,
      price: course.discountFlag ? course.discountedPrice : course.price,
      discountPrice: course.discountFlag
        ? course.discountedPrice
        : course.price,
      discount: 0,
      coupon: rewardCoupon,
      thumbnail: course.thumbnail,
      id: course.id,
    });
  }, [course]);
  return (
    <div className="container">
      <div className="content flex">
        <div className="cart">
          <table className="checkout-table">
            <thead>
              <tr>
                <th>কোর্সের নাম</th>
                <th>কোর্সের মূল্য</th>
                <th>মোট টাকা</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="কোর্সের নাম:">
                  <div className="course-item flex align-center">
                    <div className="img">
                      <Image
                        height={74}
                        width={74}
                        src={data.thumbnail || defaultCourseImage}
                        alt={data.title}
                      />
                    </div>
                    <div>
                      <Link
                        href={`/courses/${data.id}`}
                        className="course-title"
                      >
                        {data.title}
                      </Link>
                      <span className="details">
                        আপস্পট একাডেমি এমন একটি প্রতিষ্ঠান, যেখানে ফ্রীল্যান্সিং
                        কোর্স শিক্ষার একটি উন্নত মান দেয় এবং সম্প্রদায়কে
                        ক্ষমতায়ন করে।{" "}
                      </span>
                    </div>
                  </div>
                </td>
                <td data-label="কোর্সের মূল্য:">
                  <span className="number">৳{formatNumber(data.price)}</span>
                </td>
                <td data-label="মোট টাকা:">
                  <span className="number">৳{formatNumber(data.price)}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p>আপনার কি কুপন কোড আছে ? </p>
          <hr />
          <div className="cart-footer">
            <div className="coupon">
              <Coupon data={data} setData={setData} id={data.id} />
            </div>
          </div>
        </div>
        <div className="cart-subtotal">
          <h2>আপনার অর্ডার ডিটেইলস </h2>
          <div className="cart-subtotal-content">
            <div className="flex item course-price">
              <span>কোর্সের মূল্য</span>
              <span className="number">৳{formatNumber(data.price)}</span>
            </div>
            <div className="flex item coupon">
              <span>ডিসকাউন্ট </span>
              <span className="number">-৳{formatNumber(data.discount)}</span>
            </div>
            <div className="flex item total">
              <span>মোট টাকা</span>
              <span className="number">
                ৳{formatNumber(data.discountPrice)}
              </span>
            </div>
            <div className="payment-button">
              {" "}
              <div className="div">
                {isLoading ? (
                  <LoadingButton className="full-width" />
                ) : (
                  <Button
                    onClick={handlePayment}
                    text={"পেমেন্ট করুন "}
                    disabled
                    className="full-width"
                  />
                )}
              </div>
            </div>
            <hr />
            <p className="center">
              আপনি যে ব্যাংকগুলি দ্বারা পেমেন্ট করতে পারবেন।{" "}
            </p>
            <Image src={paymentOption} alt="payment option" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContainer;
