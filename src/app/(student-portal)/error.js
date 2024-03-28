"use client";

import { Button } from "@/components/button/LinkButton";
import { Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Error({ error, reset }) {
  const ref = useRef(null);
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <div className="center error" style={{
      minHeight: '70vh'
    }}>
      <lottie-player

        id="firstLottie"
        ref={ref}
        autoplay
        // controls={false}
        loop
        mode="normal"
        src="/animations/error-robot.json"
        style={{ width: "300px", height: "300px", margin:'0 auto' }}
      ></lottie-player>
      <h2>ওহো! কিছু একটা ভুল হয়েছে!</h2>
      <p>চিন্তার কারণ নেই, এটি ঠিক হয়ে যাবে। অনুগ্রহ করে , পেইজটি রিফ্রেশ করুন অথবা হোম পেইজ-এ ফিরে যান</p>
      <p>ত্রুটিটি অব্যাহত থাকলে অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন  info@upspotacademy.com</p>
      <Stack direction="row" sx={{
        margin: '0 auto',
        maxWidth: '320px'
      }} spacing={2}>
        <Button text={"Try again"} className="btn" onClick={() => reset()} />
        <Button component={Link} href={'/'} text={"Home"} className="btn" />


      </Stack>
    </div>
  );
}
