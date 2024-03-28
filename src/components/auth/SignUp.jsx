'use client'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineMail } from 'react-icons/hi';
import { MdLockOutline, MdPhoneIphone } from 'react-icons/md';
import { Button } from '../button/LinkButton';
import LoadingButton from '../button/LoadingButton';
import Input from '../input/Input';
import MailSuggest from './MailSuggest';
import { WHITELISTED_MAIL_DOMAINS } from '@/constants';
import useApp from '@/hooks/useApp';
import { emailValidation, showToast } from '@/utils/lib';
import { useLoading } from '@/utils/useCustomHook';

const SignUp = () => {
  const router = useRouter();
  const { signup: register } = useApp();
  const { isLoading, startLoading, stopLoading } = useLoading(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('পুরো নাম আবশ্যক'),
      email: Yup.string()
        .test('email-validation', 'ইমেইল এড্রেসটি সঠিক নয়', (value) => emailValidation(value))
        .required('সঠিক ইমেইল এড্রেস আবশ্যক'),
      mobileNumber: Yup.string()
        .matches(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'মোবাইল নাম্বারটি সঠিক নয়')
        .required('মোবাইল নাম্বার আবশ্যক'),
      password: Yup.string().min(6, 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষর হতে হবে').required('পাসওয়ার্ড আবশ্যক'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছেনা')
        .required('কনফার্ম পাসওয়ার্ড আবশ্যক'),
    }),
    onSubmit: async (values) => {
      startLoading();

      try {
        const res = await register(values);

        if (res?.statusCode === 400) {
          showToast(res?.message, 'error');
        }

        if (res?.user) {
          await signIn('credentials', {
            email: values.email,
            password: values.password,
          });

          router.push('/');
        }
      } catch (err) {
        showToast(err?.message, 'error');
      } finally {
        stopLoading();
      }
    },
  });

  return (
    <div className="sign-up-form">
      <form onSubmit={formik.handleSubmit}>
        <Input
          placeholder="আপনার পুরো নাম লিখুন"
          value={formik.values.fullName}
          name="fullName"
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<AiOutlineUser size={22} />}
          required
          error={formik.touched.fullName && formik.errors.fullName}
        />
                {formik.touched.fullName && formik.errors.fullName && (
          <div className="error-message">{formik.errors.fullName}</div>
        )}
        <Input
          type="email"
          placeholder="ইমেইল আইডি দিন"
          value={formik.values.email}
          name="email"
          
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<HiOutlineMail size={22} />}
          required
          error={formik.touched.email && formik.errors.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}
        {formik.touched.email && formik.errors.email && (
          <MailSuggest
            email={formik.values.email}
            updateFn={(correctedEmail) => formik.setFieldValue('email', correctedEmail)}
          />
        )}
        <Input
          placeholder="মোবাইল নাম্বার দিন"
          value={formik.values.mobileNumber}
          name="mobileNumber"
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<MdPhoneIphone size={22} />}
          required
          error={formik.touched.mobileNumber && formik.errors.mobileNumber}
        />
        {formik.touched.mobileNumber && formik.errors.mobileNumber && (
          <div className="error-message">{formik.errors.mobileNumber}</div>
        )}
        <Input
          type="password"
          placeholder="পাসওয়ার্ড দিন"
          value={formik.values.password}
          name="password"
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<MdLockOutline size={22} />}
          required
          error={formik.touched.email && formik.errors.password}
        />
        {formik.touched.email && formik.errors.password && (
          <div className="error-message">{formik.errors.password}</div>
        )}
        <Input
          type="password"
          placeholder="পাসওয়ার্ডটি আবার দিন"
          value={formik.values.confirmPassword}
          name="confirmPassword"
          onChangeHandler={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<MdLockOutline size={22} />}
          required
          error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="error-message">{formik.errors.confirmPassword}</div>
        )}
        <div className="form-group">
          {isLoading ? (
            <LoadingButton className={'full-width'} />
          ) : (
            <Button text={'সাবমিট করুন'} type="submit" className="btn full-width" />
          )}
        </div>
        <div className="form-group center">
          আপনার পূর্বে একাউন্ট থাকলে
          <Link href="/login"> লগইন করুন</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
