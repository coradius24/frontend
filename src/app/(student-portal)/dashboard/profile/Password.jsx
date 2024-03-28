"use client";
import { Button } from "@/components/button/LinkButton";
import Input from "@/components/input/Input";
import useApp from "@/hooks/useApp";
import authService from "@/services/authService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";

const Password = () => {
  const { user } = useApp();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setPasswordInfo({
      ...passwordInfo,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      if (newPassword !== confirmPassword) {
        showToast("New Password & Confirm Password, didn't match!", "error");
        return;
      }
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      showToast("Password change successfully!");
      setPasswordInfo({
        newPassword: "",
        currentPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      stopLoading();
    }
  };

  const { currentPassword, newPassword, confirmPassword } = passwordInfo;
  return (
    <div className="password-info profile-section-wrapper">
      <h3>পাসওয়ার্ড পরিবর্তন করুন</h3>
      <form className="flex" onSubmit={submitHandler}>
        <div className="current-password">
          <Input
            showLabel
            value={currentPassword}
            onChangeHandler={onChangeHandler}
            type={"password"}
            label={"বর্তমান পাসওয়ার্ড"}
            name={"currentPassword"}
            required
            placeholder={"Enter current password"}
          />
        </div>

        <Input
          showLabel
          value={newPassword}
          onChangeHandler={onChangeHandler}
          type={"password"}
          label={"নতুন পাসওয়ার্ড"}
          name={"newPassword"}
          required
          placeholder={"Enter new password"}
        />

        <Input
          showLabel
          value={confirmPassword}
          onChangeHandler={onChangeHandler}
          type={"password"}
          label={"কনফার্ম পাসওয়ার্ড"}
          name={"confirmPassword"}
          required
          placeholder={"Re-type your password"}
        />

        <Button
          type="submit"
          text={"আপডেট করুন"}
          icon={<BsCheck size={24} />}
        />
      </form>
    </div>
  );
};

export default Password;
