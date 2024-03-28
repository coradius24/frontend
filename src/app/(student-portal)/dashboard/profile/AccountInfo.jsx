"use client";
import { Button } from "@/components/button/LinkButton";
import Input from "@/components/input/Input";
import useApp from "@/hooks/useApp";
import authService from "@/services/authService";
import { showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { TagsInput } from "react-tag-input-component";

const AccountInfo = () => {
  const [skills, setSkills] = useState([]);

  const { update } = useSession();
  const router = useRouter();
  const { user } = useApp();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [userData, setUserData] = useState(() => {
    return {
      fullName: "",
      mobileNumber: "",
      dateOfBirth: "",
      title: "",
      biography: "",
    };
  });

  const { fullName, mobileNumber, dateOfBirth, title, biography } = userData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    startLoading();
    authService
      .updateProfile({
        fullName,
        profile: {
          dateOfBirth,
          title,
          skills: skills.toString(),
          biography,
        },
        mobileNumber,
      })
      .then(() => {
        update({ name: fullName });
        showToast("Successfully Updated!");
        stopLoading();
        router.refresh();
      })
      .catch((err) => {
        showToast("Something wrong Updated!", "error");
        stopLoading();
      });
  };

  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        dateOfBirth: dayjs(user.profile?.dateOfBirth).format("YYYY-MM-DD"),
        title: user.profile?.title,
        biography: user.profile?.biography,
      });
      const userSkills = user.profile?.skills?.split(",");
      setSkills(userSkills || []);
    }
  }, [user]);
  return (
    <div className="account-info profile-section-wrapper">
      <h3>পার্সোনাল ডিটেইলস</h3>
      <div className="user-profile-form">
        <form className="flex" onSubmit={submitHandler}>
          <Input
            showLabel
            value={fullName || ""}
            onChangeHandler={onChangeHandler}
            label={"আপনার পুরো নাম"}
            name={"fullName"}
            placeholder={"আপনার পুরো নাম"}
          />
          <Input
            showLabel
            value={user?.email || ""}
            onChangeHandler={onChangeHandler}
            label={"আপনার ইমেইল"}
            name={"email"}
            disabled
            placeholder={"email@gamil.com"}
          />

          <Input
            showLabel
            value={mobileNumber || ""}
            onChangeHandler={onChangeHandler}
            label={"মোবাইল নাম্বার"}
            name={"mobileNumber"}
            type={"text"}
            placeholder={"Mobile Number"}
          />
          <Input
            showLabel
            value={dateOfBirth}
            onChangeHandler={onChangeHandler}
            label={"জন্ম তারিখ"}
            name={"dateOfBirth"}
            type={"date"}
          />

          <Input
            showLabel
            value={title || ""}
            onChangeHandler={onChangeHandler}
            label={"টাইটেল"}
            name={"title"}
            type={"text"}
            placeholder={"টাইটেল"}
          />
          <div className="form-group"></div>
          <div className="skills form-group">
            <label htmlFor="skills">স্কিলস</label>
            <TagsInput
              showLabel
              value={skills || ""}
              onChange={setSkills}
              label={"স্কিলস"}
              name={"skills"}
              type={"text"}
              placeholder={"স্কিলস"}
            />
          </div>
          <div className="biography form-group">
            <div className="form-group free-class-comment">
              <label htmlFor="biography">বায়োগ্রাফি</label>
              <textarea
                style={{ width: '100%', display: 'block', border: '1px solid #9999993d', borderRadius: 8, padding: '10px' }}
                id="biography"
                aria-label="মন্তব্য:"
                className="form-control"
                name="biography"
                rows={3}
                onChange={(e) =>
                  setUserData({ ...userData, biography: e.target.value })
                }
                value={biography}
                placeholder="আপনার সম্পর্কে লিখুন"
              />
            </div>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            text={"আপডেট করুন"}
            icon={<BsCheck size={24} />}
          />
        </form>
      </div>
    </div>
  );
};

export default AccountInfo;
