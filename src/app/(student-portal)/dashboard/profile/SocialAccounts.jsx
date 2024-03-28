"use client";
import { Button } from "@/components/button/LinkButton";
import Input from "@/components/input/Input";
import useApp from "@/hooks/useApp";
import authService from "@/services/authService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import { useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";

const SocialAccounts = () => {
  const { user } = useApp();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [socialLinks, setSocialLinks] = useState(() => {
    return {
      twitter: "",
      facebook: "",
      linkedin: "",
      instagram: "",
    };
  });

  useEffect(() => {
    if (user) {
      setSocialLinks({
        ...user?.profile?.socialLinks,
      });
    }
  }, [user]);

  const { facebook, twitter, linkedin, instagram } = socialLinks;

  const socialLinksHandler = (e) => {
    const { name, value } = e.target;
    setSocialLinks({
      ...socialLinks,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    startLoading();
    authService
      .updateProfile({
        profile: {
          socialLinks: {
            twitter,
            facebook,
            linkedin,
            instagram,
          },
        },
      })
      .then((res) => {
        showToast("Successfully update.");
        stopLoading();
      })
      .catch((error) => {
        showToast(error.message, "error");
        stopLoading();
      });
  };
  return (
    <div className="social-accounts profile-section-wrapper">
      <h3>আপনার সোশ্যাল মিডিয়া প্রোফাইল</h3>
      <form className="flex" onSubmit={submitHandler}>
        <Input
          showLabel
          onChangeHandler={socialLinksHandler}
          value={facebook || ""}
          label={"ফেসবুক আইডি "}
          name={"facebook"}
          type={"url"}
          placeholder={"https://facebook.com/username"}
        />
        <Input
          showLabel
          onChangeHandler={socialLinksHandler}
          value={instagram || ""}
          label={"ইন্সটাগ্রাম  "}
          name={"instagram"}
          type={"url"}
          placeholder={"https://instagram.com/username"}
        />
        <Input
          showLabel
          onChangeHandler={socialLinksHandler}
          value={twitter || ""}
          label={"Add your twitter link:"}
          name={"twitter"}
          type={"url"}
          placeholder={"https://twitter.com/username"}
        />
        <Input
          showLabel
          onChangeHandler={socialLinksHandler}
          value={linkedin || ""}
          label={"Add your linkedin link"}
          name={"linkedin"}
          type={"url"}
          placeholder={"https://www.linkedin.com/in/username"}
        />
        <Button
          disabled={isLoading}
          type="submit"
          text={"আপডেট করুন"}
          icon={<BsCheck size={24} />}
        />
      </form>
    </div>
  );
};

export default SocialAccounts;
