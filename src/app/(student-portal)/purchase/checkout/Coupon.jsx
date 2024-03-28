"use client";
import { Button } from "@/components/button/LinkButton";
import LoadingButton from "@/components/button/LoadingButton";
import Input from "@/components/input/Input";
import { baseURL } from "@/services/api/apiService";
import couponService from "@/services/couponService";
import { checkExpireDate, showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import { useEffect, useRef } from "react";

const Coupon = ({ id, data, setData }) => {
  const formRef = useRef();
  const { isLoading, startLoading, stopLoading } = useLoading(false);

  useEffect(() => {
    if (id) {
      getRewardCoupon();
    }
  }, [id]);

  const onChangeHandler = (e) => {
    const { value } = e.target;
    setData({
      ...data,
      coupon: value,
    });
  };

  const submitHandler = (e) => {
    e && e.preventDefault();
    if (data.discount > 0) {
      return;
    }
    startLoading();
    couponService
      .applyCoupon(`code=${data.coupon}&courseId=${id}`)
      .then((res) => {
        const { discountAmount, expiry, discountType } = res;
        const isExpired = expiry ? checkExpireDate(expiry) : false;
        if (isExpired) {
          return showToast("Invalid Coupon!", "error");
        }
        if (discountType === "flat") {
          const updatePrice = data.price - discountAmount;
          setData({
            ...data,
            discountPrice: updatePrice,
            discount: discountAmount,
          });
        } else {
          const updatePrice = calculatePercentage(data.price, discountAmount);
          setData({
            ...data,
            discount: data.price - updatePrice,
            discountPrice: updatePrice,
          });
        }
      })
      .catch((err) => {
        showToast(err.message, "error");
      })
      .finally(() => {
        stopLoading();
      });
  };

  const getRewardCoupon = () => {
    fetch(`${baseURL}/api/coupons/my-reward-coupons`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 404) {
          if (formRef.current) {
            submitHandler();
          }
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  return (
    <>
      <form className="coupon-box flex" onSubmit={submitHandler} ref={formRef}>
        <Input
          required
          disabled={isLoading || data.discount > 0}
          name={"coupon"}
          value={data.coupon}
          onChangeHandler={onChangeHandler}
          placeholder={"কুপন কোড ব্যবহার করুন "}
        />
        {isLoading ? (
          <LoadingButton className="full-width card-btn" />
        ) : (
          <Button
            disabled={isLoading || data.discount > 0 || !data.coupon}
            type="submit"
            className="full-width card-btn"
            text={"সাবমিট করুন"}
          />
        )}
      </form>
    </>
  );
};

export default Coupon;

function calculatePercentage(value, percentage) {
  if (percentage >= 0 && percentage <= 100) {
    return (value * percentage) / 100;
  } else {
    return value;
  }
}
