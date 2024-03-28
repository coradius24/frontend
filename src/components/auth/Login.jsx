"use client";
import authService from "@/services/authService";
import { emailValidation, showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import { mailSuggest } from "@/utils/utils";
import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiOutlineMail } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import * as Yup from "yup";
import { Button } from "../button/LinkButton";
import LoadingButton from "../button/LoadingButton";
import Input from "../input/Input";
import MailSuggest from "./MailSuggest";

const Login = () => {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const { isLoading, startLoading, stopLoading } = useLoading(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .test("email-validation", "ইমেইল এড্রেসটি সঠিক নয়", (value) =>
          emailValidation(value, true)
        )
        .required("ইমেইল এড্রেস আবশ্যক"),
      password: Yup.string()
        .min(4, "ন্যূনতম ৪ অক্ষরের পাসওয়ার্ডটি দিন")
        .required("পাসওয়ার্ড আবশ্যক"),
    }),
    onSubmit: async (values) => {
      try {
        startLoading();
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (res.error) {
          if (res.error === "Unauthorized") {
            showToast("ইমেইল বা পাসওয়ার্ড ভুল!", "error");
          } else {
            showToast(res.error, "error");
          }
        } else {
          await authService.getCurrentUser(getCookie("access_token"));
          if (callbackUrl && callbackUrl.includes("htt")) {
            const url = new URL(callbackUrl);
            if (!callbackUrl) {
              return window.location.replace("/dashboard/notices");
            }
            return window.location.replace(url);
          } else if (callbackUrl) {
            return window.location.replace(
              `${window.location.origin}/${callbackUrl}`
            );
          } else if (!callbackUrl) {
            return window.location.replace("/dashboard/notices");
          } else {
            window.location.reload();
          }
        }
      } catch (error) {
        showToast("কিছু ভুল হয়েছে!", "error");
      } finally {
        stopLoading();
      }
    },
  });

  return (
    <div className="sign-up-form">
      <form onSubmit={formik.handleSubmit}>
        <Input
          type="email"
          label="Email"
          value={formik.values.email}
          placeholder="ইমেইল আইডি দিন"
          name="email"
          required
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<HiOutlineMail size={22} />}
          error={formik.touched.email && formik.errors.email}
        />

        {!!mailSuggest(formik.values.email)?.length && (
          <MailSuggest
            hideWhitelist
            email={formik.values.email}
            updateFn={(email) => formik.setFieldValue("email", email)}
          />
        )}
        <Input
          className="mb-1"
          type="password"
          label="Password"
          value={formik.values.password}
          placeholder="পাসওয়ার্ড দিন"
          name="password"
          required
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<MdLockOutline size={22} />}
          helperText={formik.touched.password && formik.errors.password}
          error={formik.touched.password && formik.errors.password}
        />
        <p className="forget-pass-text">
          পাসওয়ার্ড পরিবর্তন/ভুলে গেলে{" "}
          <Link className="text-primary" href="/login/forgot_password_request">
            এখানে ক্লিক করুন
          </Link>
        </p>
        <div className="form-group">
          {isLoading ? (
            <LoadingButton className={"full-width mt-4"} />
          ) : (
            <Button
              type="submit"
              text="সাবমিট করুন"
              className="btn full-width"
            />
          )}
        </div>
        <p className="register-text center">
          আপনার পূর্বে একাউন্ট নাই?{" "}
          <Link className="" href="/register">
            সাইন আপ করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
