"use client";
import { Button } from "@/components/button/LinkButton";
import LoadingButton from "@/components/button/LoadingButton";
import CustomModal from "@/components/modal/CustomModal";
import paymentService from "@/services/paymentService";
import { useLoading } from "@/utils/useCustomHook";
import Image from "next/image";
import { useState } from "react";
import { MdOutlineLayers, MdPayments } from "react-icons/md";
import CourseResourceItem from "./CourseResourceItem";
import "./tools.css";

const ToolsItem = ({ tools = [], invoiceOfTheCourse, courseId }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const handlePayment = async () => {
    return;
    startLoading();
    const res = await paymentService.createPayment({
      courseId: courseId,
      amount: invoiceOfTheCourse.due,
    });
    window.location.assign(res.checkout_url);
  };

  const [modalOpen, setModalOpen] = useState(false);
  if (tools.length == 0) {
    return <p className="no-tools">No tools found</p>;
  }
  return (
    <div className="recourse-and-tools">
      {tools.map((item) => {
        const icon = item.thumbnail ? (
          <Image
            className="thumbnail"
            height={487}
            width={880}
            src={item.thumbnail.url}
            alt={item.name}
          />
        ) : (
          <MdOutlineLayers size={26} />
        );
        return (
          <CourseResourceItem className="single-tool" icon={icon} key={item.id}>
            <p>{item.name}</p>
            {item?.accessRestricted ? (
              <CustomModal
                handleModalOpen={() => setModalOpen(true)}
                handleModalClose={() => setModalOpen(false)}
                modalIsOpen={modalOpen}
                triggerButton={
                  <Button
                    className="btn-info"
                    text={"অ্যাক্সেস করুন"}
                    size={16}
                  />
                }
              >
                {" "}
                <div className="tools-modal modal-content center">
                  <div className="icon">
                    <MdPayments size={40} color="#fff" />
                  </div>
                  <>
                    <h3>দুঃখিত, আপনার বকেয়া পরিশোধ করুন !</h3>
                    <p>
                      আমাদের টুলস এবং রিসোর্স অ্যাক্সেস করার জন্য আপনাকে অবশ্যই
                      আপনার বকেয়া পরিশোধ করতে হবে।{" "}
                    </p>
                    <div className="due-amount">
                      <p>আপনার বকেয়া রয়েছে</p>
                      <span className="amount">
                        ৳{invoiceOfTheCourse?.due || 0}
                      </span>
                    </div>
                    {isLoading ? (
                      <LoadingButton />
                    ) : (
                      <Button
                        disabled
                        onClick={handlePayment}
                        text={"পেমেন্ট করুন "}
                        size={20}
                      />
                    )}
                  </>
                </div>
              </CustomModal>
            ) : (
              <a target="_blank" href={`${item.link}?accessToken=${localStorage.getItem('access_token')}`}>
                <Button
                  className="btn-info"
                  text={"অ্যাক্সেস করুন"}
                  size={16}
                />
              </a>
            )}
          </CourseResourceItem>
        );
      })}
    </div>
  );
};

export default ToolsItem;
