"use client";
import useApp from "@/hooks/useApp";
import { BiRightArrowAlt } from "react-icons/bi";
import VerifyAccount from "./profile/VerifyAccount";

function AlertArea() {
  const { user } = useApp();

  return (
    <div className="alert-area">
      {user && !user?.isKycVerified && (
        <div className="kyc-required-alert">
          <div>
            <span className="text-red">*</span>আপনার অ্যাকাউন্ট এখনো ভেরিফাই
            হয়নি, সঠিক ইনফরমেশন দিয়ে আপনার অ্যাকাউন্ট{" "}
            <div className="modal-trigger">
              {" "}
              <VerifyAccount>
                <strong>
                  {" "}
                  <u className="text-primary">ভেরিফাই করুন</u>{" "}
                  <BiRightArrowAlt className="text-primary arrow-icon" />
                </strong>{" "}
              </VerifyAccount>
            </div>{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertArea;
