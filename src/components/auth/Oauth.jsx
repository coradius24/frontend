"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Oauth = () => {
  return (
    <div className="o-auth">
      <button type="button" className="google" onClick={() => signIn("google")}>
        <Image height={30} width={30} alt="google" src={"./google.svg"} />
        <span>Google দিয়ে সাইন আপ করুন</span>
      </button>
    </div>
  );
};

export default Oauth;
