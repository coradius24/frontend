"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Error({ error, reset }) {
  const ref = useRef(null);
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <Stack direction="column" sx={{
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }} className="center error">
      <lottie-player
        id="firstLottie"
        ref={ref}
        autoplay
        // controls={false}
        loop
        mode="normal"
        src="/animations/error-robot.json"
        style={{ width: "300px", height: "300px" }}
      ></lottie-player>
      <h2>ওহো! কিছু একটা ভুল হয়েছে!</h2>
      <p>চিন্তার কারণ নেই, এটি ঠিক হয়ে যাবে। অনুগ্রহ করে , পেইজটি রিফ্রেশ করুন অথবা হোম পেইজ-এ ফিরে যান</p>
      <p>ত্রুটিটি অব্যাহত থাকলে অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন  info@upspotacademy.com</p>
      <Stack direction="row" spacing={2}>
        <Button className="btn" onClick={() => reset()} >Try again</Button>
        <Button component={Link} href={'/'} className="btn">Home </Button>


      </Stack>
    </Stack>
  );
}
