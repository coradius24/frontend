"use client";
import { Button } from "@/components/button/LinkButton";
import {
  ClassJoinModal,
  isDateTimeGreaterThan10Minutes,
  sortLiveClassesByDate,
} from "@/components/header/SignOut";
import useApp from "@/hooks/useApp";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { HiOutlineCalendar } from "react-icons/hi";
import LiveClassTimer from "./LiveClassTimer";
import "./live-class.css";

const LiveClasses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const { liveClasses } = useApp();

  const handleSelected = (item) => {
    setSelectedClass(item);
    const isGreater = isDateTimeGreaterThan10Minutes(item.dateTime);
    if (isGreater) {
      return setModalOpen(!modalOpen);
    }
    window.open(item.zoomMeetingLink, "_blank");
  };

  return (
    <div className="live-class">
      {liveClasses.length === 0 ? (
        <p>You have't any live class!</p>
      ) : (
        <>
          {sortLiveClassesByDate(liveClasses).map((item) => (
            <div key={item.id} className="live-class-item flex">
              <div className="live-class-course flex">
                <div className="image">
                  <Image
                    src={
                      item?.course?.thumbnail ||
                      "/course_thumbnail_placeholder.jpg"
                    }
                    height={70}
                    width={70}
                    alt="course title"
                  />
                </div>
                <div className="course-info">
                  <p>
                    {item?.course?.title} {item?.course?.batchTitle}
                  </p>
                  <div className="live-class-instructor flex">
                    <div className="avatar">
                      <Image
                        src={"/user.png"}
                        height={24}
                        width={24}
                        alt="course title"
                      />
                    </div>
                    <div className="flex">
                      <div className="name">
                        <p>{item?.course?.instructor?.fullName}</p>
                      </div>
                      <span>{item?.course?.instructor?.title}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="live-class-schedule">
                <p className="flex">
                  {" "}
                  <HiOutlineCalendar size={14} /> ক্লাস শিডিউল
                </p>
                <span>{item?.course?.liveClassSchedule}</span>
              </div>
              {!item.isOnGoing && (
                <div className="next-class flex">
                  <span> পরবর্তী ক্লাস শুরু হতে বাকি</span>
                  <span className="text-primary" style={{ fontWeight: "600" }}>
                    {dayjs(item?.dateTime).format("DD/MM/YYYY")}
                  </span>
                  <span className="text-primary" style={{ fontWeight: "600" }}>
                    {dayjs(item?.dateTime).format("h:mm:ss A")}
                  </span>
                </div>
              )}
              {item.isOnGoing ? (
                <p>ক্লাস শুরু হয়েছে </p>
              ) : (
                <LiveClassTimer date={item?.dateTime} />
              )}
              <div className="live-class-joining-button">
                <Button
                  onClick={() => handleSelected(item)}
                  text={"ক্লাসে জয়েন করুন "}
                />
              </div>
            </div>
          ))}
          <ClassJoinModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            info={selectedClass}
          />
        </>
      )}
    </div>
  );
};

export default LiveClasses;
