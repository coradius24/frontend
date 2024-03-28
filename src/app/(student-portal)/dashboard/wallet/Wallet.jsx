"use client";
import bkash from "@/../public/bkash.svg";
import nagad from "@/../public/nagad.svg";
import rocket from "@/../public/rocket.svg";
import { Button } from "@/components/button/LinkButton";
import ContainerHeader from "@/components/dashboard/ContainerHeader";
import FormInput from "@/components/input/Input";
import CustomModal from "@/components/modal/CustomModal";
import useApp from "@/hooks/useApp";
import earningService from "@/services/earningService";
import { formatNumber, showToast } from "@/utils/lib";
import { useLoading } from "@/utils/useCustomHook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import AlertArea from "../AlertArea";
import WithdrawReport from "./WithdrawReport";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "10px",
    padding: "6px",
  }),
};

const options = [
  { value: "bKash", label: "Bkash", image: bkash },
  { value: "Nagad", label: "Nagad", image: nagad },
  { value: "rocket", label: "Rocket", image: rocket },
];

const Wallet = ({ walletStatics, data }) => {
  const { user } = useApp();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: null,
    mobileBanking: "",
    message: "",
  });
  const { amount, message, mobileBanking, paymentMethod } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    startLoading();
    e.preventDefault();
    const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!regex.test(mobileBanking)) {
      stopLoading();
      return showToast("Invalid Mobile number!", "error");
    }
    earningService
      .paymentRequest({
        amount: parseInt(amount),
        accountNumber: mobileBanking,
        payoutMethod: paymentMethod.value,
      })
      .then((res) => {
        if (res.raw) {
          router.refresh();
          return showToast("Successfully added payment request!");
        }
        showToast(res.message, "error");
      })
      .finally(() => {
        stopLoading();
        setModalOpen(false);
      });
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const isKycVerified = user?.isKycVerified;
  return (
    <div className="earning-report">
      <ContainerHeader title={"পেমেন্ট উঠান"}>
        <div className="content">
          <CustomModal
            containerClass={"payment-modal modal-small"}
            title={`${
              isKycVerified
                ? "আপনার পেমেন্ট মেথড যোগ করুন"
                : "অ্যাকাউন্ট ভেরিফিকেশন"
            }`}
            handleModalOpen={handleModalOpen}
            handleModalClose={() => setModalOpen(false)}
            modalIsOpen={modalOpen}
            triggerButton={<Button text={"পেমেন্ট উঠান "} />}
          >
            <div className="payment-modal-content">
              {isKycVerified ? (
                <form onSubmit={submitHandler}>
                  <FormInput
                    showLabel
                    type={"number"}
                    required
                    value={amount || ""}
                    onChangeHandler={onChangeHandler}
                    label={"Amount"}
                    name={"amount"}
                    placeholder={"Amount"}
                    min="5"
                  />
                  <div className="form-group document-type">
                    <label>Select Payment Method</label>
                    <Select
                      required
                      styles={customStyles}
                      className="payment-method-picker"
                      isSearchable={false}
                      placeholder="Select your bank"
                      name="paymentMethod"
                      onChange={(data) => {
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: data,
                        }));
                      }}
                      value={paymentMethod}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: "#F2FCF3",
                          primary: "#19891C",
                        },
                      })}
                      formatOptionLabel={(payment) => (
                        <div className="payment-option">
                          <Image
                            src={payment.image}
                            alt={payment}
                            height={18}
                            width={18}
                          />
                          <span>{payment.label}</span>
                        </div>
                      )}
                      options={options}
                    />
                  </div>
                  <FormInput
                    required
                    showLabel
                    value={mobileBanking || ""}
                    onChangeHandler={onChangeHandler}
                    label={"Mobile Banking Number"}
                    name={"mobileBanking"}
                    placeholder={"Enter mobile  banking number"}
                  />
                  <div className="form-group free-class-comment hidden">
                    <label htmlFor="message">Your Message (Optional)</label>
                    <textarea
                      onChange={onChangeHandler}
                      id="message"
                      value={message}
                      aria-label="message"
                      className="form-control"
                      name="message"
                      rows={4}
                      placeholder="Write your message here"
                    />
                  </div>
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="full-width submit"
                    text={"সাবমিট করুন"}
                  />
                </form>
              ) : (
                <div>
                  <AlertArea />
                </div>
              )}
            </div>
          </CustomModal>
        </div>
      </ContainerHeader>
      <hr />
      <div className="earning-statics flex">
        <div className="item center">
          <p>মোট আর্নিং হয়েছে</p>
          <span>${formatNumber(walletStatics.totalEarnings)}</span>
        </div>
        <div className="item center">
          <p>উত্তোলন করেছেন </p>
          <span>${formatNumber(walletStatics.withdrawnTotal)}</span>
        </div>
        <div className="item center">
          <p>বর্তমান ব্যালেন্স আছে</p>
          <span>${formatNumber(walletStatics.currentBalance)}</span>
        </div>
      </div>
      <WithdrawReport data={data} />
    </div>
  );
};

export default Wallet;
