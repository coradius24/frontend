"use client";
import useApp from "@/hooks/useApp";
import preRegistrationService from "@/services/preRegistrationService";
import { showToast } from "@/utils/lib";
import { SweetAlert } from "@/utils/sweet-alert";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { Button } from "../button/LinkButton";
import LoadingButton from "../button/LoadingButton";
import Input from "../input/Input";
import "./free-class.css";

const validationSchema = yup.object().shape({
  fullName: yup.string().required("নাম লেখা বাধ্যতামূলক!"),
  email: yup.string().required("আপনার সঠিক ইমেইল এড্রেস দিন!"),
  mobileNumber: yup
    .string()
    .required("সঠিক মোবাইল নম্বর বাধ্যতামূলক!")
    .matches(/^(\+?88)?01\d{9}$/, "সঠিক মোবাইল নম্বর বাধ্যতামূলক"),
  comment: yup.string().nullable("মন্তব্য 3000 অক্ষরের বেশি হওয়া যাবে না!"),
});

const FreeClass = () => {
  const { user } = useApp();

  const [data, setData] = useState({
    isLoaded: false,
    data: null,
    isSubmitting: false,
  });

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobileNumber: user?.mobileNumber || "",
      comment: "",
    },
    validationSchema,
    onSubmit: (values) => {
      submitHandler();
    },
  });

  useEffect(() => {
    preRegistrationService
      .checkEligibility(
        JSON.parse(localStorage.getItem("preRegistered") || "{}")
      )
      .then((data) => {
        setData({
          isLoaded: true,
          data,
        });
      });
  }, []);

  const submitHandler = async () => {
    if (data.isSubmitting) return;
    // toto actual login
    try {
      setData((prev) => ({
        ...prev,
        isSubmitting: true,
      }));
      const res = await preRegistrationService.submit(formik.values);

      if (res?.statusCode == 400) {
        setData((prev) => ({
          ...prev,
          isLoaded: true,
          isSubmitting: false,
        }));
        SweetAlert.fire({
          title: "দুঃখিত",
          html: (
            <ul>
              {typeof res?.message == "string"
                ? res?.message
                : res?.message?.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ),
          icon: "error",
        });
      } else {
        showToast("Registered for free class");
        localStorage.setItem(
          "preRegistered",
          JSON.stringify({
            mobileNumber: formik.values.mobileNumber,
            email: formik.values.email,
          })
        );
        setData({
          isLoaded: true,
          isSubmitting: false,
          data: {
            eligible: false,
            alreadyRegistered: true,
          },
        });
      }
    } catch (error) {
      showToast(error?.message || error, "error");
    }
  };

  return (
    <section className="section-free-class">
      <div className="container">
        <div className="content">
          <div className="header center">
            <h2 className="mb-3">অনলাইন ফ্রী ক্লাসের জন্য রেজিস্ট্রেশন</h2>
            <p className="px-md-5">
              প্রফেশনাল সিপিএ মার্কেটিং এর ফ্রি ক্লাস করার জন্য সঠিক তথ্য দিয়ে
              নিচের ফর্মটি পুরন করুন
            </p>
          </div>
          {!data?.isLoaded && (
            <div className="free-class-registered">
              <CircularProgress />
            </div>
          )}

          {data?.data?.alreadyEnrolled && (
            <div className="free-class-registered">
              <h4>এটি আপনার জন্য প্রযোজ্য নয়</h4>
              <p>
                আপনি ইতোমধ্যে এই প্ল্যাটফর্ম এর একজন শিক্ষার্থী হিসেবে সংযুক্ত
                রয়েছেন
              </p>
            </div>
          )}
          {data?.data?.alreadyRegistered && !data?.alreadyEnrolled && (
            <div className="free-class-registered">
              <h4>ধন্যবাদ আপনাকে</h4>
              <p>আপনি ইতোমধ্যে ফ্রি ক্লাসের জন্য রেজিস্ট্রেশন করেছেন</p>
            </div>
          )}
          {data?.data?.eligible && (
            <form onSubmit={formik.handleSubmit}>
              <Input
                showLabel
                autofocus
                className="mb-3"
                label="আপনার পুরো নাম"
                placeholder="আপনার নাম লিখুন"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <Input
                showLabel
                className="mb-3"
                label="আপনার ইমেইল"
                type={"email"}
                placeholder="ইমেইল এড্রেস লিখুন"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <Input
                showLabel
                className="mb-3"
                label="মোবাইল নাম্বার"
                placeholder="মোবাইল নাম্বার লিখুন"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.mobileNumber &&
                  Boolean(formik.errors.mobileNumber)
                }
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                }
              />
              <div className="form-group free-class-comment">
                <label htmlFor="comment">আপনি কিছু লিখতে চাচ্ছেন কি?</label>
                <textarea
                  id="comment"
                  aria-label="মন্তব্য:"
                  className="form-control"
                  name="comment"
                  rows={4}
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  placeholder="আপনার মন্তব্য লিখুন"
                  // error={formik.touched.email && Boolean(formik.errors.email)}
                  // helperText={formik.touched.email && formik.errors.email}
                />
                {formik.touched.comment && formik.errors.comment && (
                  <p className="text-red">{formik.errors.comment}</p>
                )}
              </div>
              <div className="form-group">
                {data?.isSubmitting ? (
                  <LoadingButton className={"full-width mt-4"} />
                ) : (
                  <Button
                    text={" সাবমিট করুন"}
                    type="submit"
                    className="btn full-width"
                  />
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default FreeClass;
