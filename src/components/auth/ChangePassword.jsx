"use client";
import apiService from "@/services/api/apiService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdLockOutline } from "react-icons/md";
import { Button } from "../button/LinkButton";
import Input from "../input/Input";

const ChangePassword = ({ type = "reset" }) => {
  let url = "/api/auth/reset-password";
  if (type === "set") {
    url = "/api/auth/set-password";
  }
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [passwordInfo, setPasswordInfo] = useState({
    password: "",
    confirmPassword: "",
  });

  const { isLoading, startLoading, stopLoading } = useLoading();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setPasswordInfo({
      ...passwordInfo,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Password & confirm password miss match!", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password length too short!", "error");
      return;
    }
    try {
      startLoading();
      let tokenObj = {
        reset_token: token,
      };
      if (type === "set") {
        tokenObj = {
          token: token,
        };
      }
      await apiService.post(url, {
        password,
        ...tokenObj,
      });
      showToast("Updated Successfully");
      router.push("/login");
    } catch (error) {
      stopLoading();
      showToast("Please try again!", "error");
    }
  };
  const { password, confirmPassword } = passwordInfo;
  return (
    <div className="forgot-password-form">
      <form onSubmit={submitHandler}>
        <Input
          type={"password"}
          name="password"
          onChangeHandler={onChangeHandler}
          label="password"
          value={password}
          icon={<MdLockOutline size={22} />}
          placeholder={"নতুন পাসওয়ার্ড টাইপ করুন "}
          required
        />
        <Input
          type={"password"}
          name="confirmPassword"
          onChangeHandler={onChangeHandler}
          label="confirmPassword"
          value={confirmPassword}
          icon={<MdLockOutline size={22} />}
          placeholder={"আবার নতুন পাসওয়ার্ড টাইপ করুন"}
          required
        />
        <div className="form-group">
          <Button
            disabled={isLoading}
            text={"আপডেট"}
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

export default ChangePassword;
