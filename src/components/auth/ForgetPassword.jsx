"use client";
import apiService from "@/services/api/apiService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { Button } from "../button/LinkButton";
import Input from "../input/Input";
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoading();
  const onChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      await apiService.post("/api/auth/forgot-password", { email });
      showToast("Please check your email to change your password!");
    } catch (error) {
      stopLoading();
      showToast("Please try again!", "error");
    }
  };

  return (
    <div className="forgot-password-form">
      <form onSubmit={submitHandler}>
        <Input
          type={"email"}
          name="email"
          onChangeHandler={onChangeHandler}
          label="email"
          value={email}
          icon={<HiOutlineMail size={22} />}
          placeholder={"আপনার ইমেইল আইডি দিন"}
          required
        />
        <div className="form-group">
          <Button
            disabled={isLoading}
            text={"সাবমিট করুন"}
            type="submit"
            className="btn full-width"
          />
        </div>
        <div className="form-group center">
          লগইন করতে ফিরে যেতে চান ?<Link href="/login"> ক্লিক করুন</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
