"use client";
import LiveClassTimer from "@/app/(student-portal)/dashboard/live-class/LiveClassTimer";
import useApp from "@/hooks/useApp";
import apiService from "@/services/api/apiService";
import { deleteCookie } from "cookies-next";
import dayjs from "dayjs";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { PiSignOut } from "react-icons/pi";
import { Button } from "../button/LinkButton";
import CustomModal from "../modal/CustomModal";
import "./live-class-join.css";
import joinSvg from "/public/join.svg";

const SignOut = () => {
  const onClickHandler = async () => {
    await apiService.get("/api/auth/logout");
    deleteCookie("access_token");
    signOut();
  };
  return (
    <li className="dropdown-user-logout user-dropdown-menu-item">
      <Link href="#" onClick={onClickHandler}>
        <PiSignOut size={20} />
        Log Out
      </Link>
    </li>
  );
};

export default SignOut;

export const DashboardLogout = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { liveClasses } = useApp();
  const onClickHandler = async () => {
    await apiService.get("/api/auth/logout");
    signOut();
  };

  const upComingClass =
    (liveClasses && sortLiveClassesByDate(liveClasses)[0]) || {};

  const handleModalOpen = () => {
    const isGreater = isDateTimeGreaterThan10Minutes(upComingClass.dateTime);
    if (isGreater) {
      return setModalOpen(!modalOpen);
    }
    window.open(upComingClass.zoomMeetingLink, "_blank");
  };

  return (
    <div className="sidebar-bottom">
      {upComingClass.dateTime && (
        <>
          <ClassJoinModal
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
            info={upComingClass}
          />
          <div className="live-class-container">
            <div className="icon">
              <Image src={joinSvg} alt="team" />
            </div>
            <div className="next-class-timer-area center">
              {upComingClass.isOnGoing ? (
                <p style={{ marginBottom: "10px" }}>ক্লাস শুরু হয়েছে </p>
              ) : (
                <p>আপনার পরবর্তী লাইভ ক্লাস শুরু হতে বাকি</p>
              )}
              {!upComingClass.isOnGoing && (
                <>
                  <span className="text-primary" style={{ fontWeight: "600" }}>
                    {" "}
                    {dayjs(upComingClass?.dateTime).format("DD/MM/YYYY")}
                  </span>
                  <span className="text-primary" style={{ fontWeight: "600" }}>
                    {dayjs(upComingClass?.dateTime).format("h:mm:ss A")}
                  </span>
                  <LiveClassTimer date={upComingClass.dateTime} />
                </>
              )}
              <Button
                text={"ক্লাসে জয়েন করুন "}
                onClick={() => handleModalOpen()}
              />
            </div>
          </div>
        </>
      )}
      <div className="logout-container" onClick={onClickHandler}>
        <span className="full-width flex align-center">
          <span className="flex">
            <AiOutlineLogout size={24} />
          </span>
          <span> লগ আউট </span>
        </span>
      </div>
    </div>
  );
};

function compareDates(a, b) {
  const dateA = dayjs(a.dateTime);
  const dateB = dayjs(b.dateTime);

  return dateA - dateB;
}

export function sortLiveClassesByDate(events) {
  const currentDate = dayjs();
  const filteredEvents = events.filter((event) => {
    const eventDate = dayjs(event.dateTime);

    return event.isOnGoing || eventDate.isAfter(currentDate);
  });

  const filteredAndSorted = filteredEvents.sort(compareDates);
  return filteredAndSorted;
}

export function isDateTimeGreaterThan10Minutes(dateTime) {
  const providedDateTime = dayjs(dateTime);
  const currentTime = dayjs();
  const differenceInMinutes = providedDateTime.diff(currentTime, "minute");
  return differenceInMinutes > 10;
}

export const ClassJoinModal = ({ modalOpen, setModalOpen, info = {} }) => {
  if (!info.id) {
    return null;
  }

  let isOpen = isDateTimeGreaterThan10Minutes(info.dateTime || new Date());

  return (
    <CustomModal
      containerClass={"live-class-join-modal"}
      title={"ক্লাসে যোগ দিন"}
      handleModalOpen={() => setModalOpen(true)}
      handleModalClose={() => setModalOpen(false)}
      modalIsOpen={modalOpen}
    >
      <div className="live-class-join-modal-content">
        {isOpen ? (
          <>
            <div
              style={{ marginBottom: "10px" }}
              dangerouslySetInnerHTML={{ __html: info.noteToStudents }}
            ></div>
            <Link className="btn" href={info.zoomMeetingLink} target="_blank">
              {" "}
              ক্লাসে জয়েন করুন
            </Link>
          </>
        ) : (
          <div className="class-join-info">
            <div>
              <span>মীটিং লিংক:</span>
              <span>
                <a href={info.zoomMeetingLink} target="_blank">
                  ক্লাসে যোগ দিন
                </a>
              </span>
            </div>
            <div>
              <span>জুম মিটিং আইডি:</span>
              <span>{info.zoomMeetingId}</span>
            </div>
            <div>
              <span>জুম মিটিং পাসওয়ার্ড:</span>
              <span>{info.zoomMeetingPassword}</span>
            </div>
            <div>
              <span>নোট:</span>
              <span>{info.noteToStudents}</span>
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};
