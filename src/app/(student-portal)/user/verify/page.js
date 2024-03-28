"use client";
import Loading from "@/components/Loading";
import { baseURL } from "@/services/api/apiService";
import { showToast } from "@/utils/lib";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./page.css";

const verifyToken = async (token) => {
  const res = await fetch(`${baseURL}/api/auth/verify-email/${token}`, {
    cache: "no-cache",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

const Page = ({ searchParams }) => {
  const router = useRouter();
  useEffect(() => {
    verifyToken(searchParams.token)
      .then((res) => {
        if (res.success) {
          showToast("আপনার ইমেল ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে");
          return router.replace("/");
        } else {
          showToast("আপনার ইমেল ভেরিফিকেশন সফল হয়নি", "error");

          return router.replace("/");
        }
      })
      .catch((error) => {
        console.log("error", error);
        showToast("আপনার ইমেল ভেরিফিকেশন সফল হয়নি", "error");
        return router.replace("/");
      });
  }, []);

  return (
    <>
      <div className="d-flex loader align-items-center justify-content-center pt-5">
        <Loading />
      </div>
    </>
  );
};

export default Page;
