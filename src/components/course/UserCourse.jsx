"use client";
import { useState } from "react";
import ContainerHeader from "../dashboard/ContainerHeader";
import EnrolledCourseCard from "./EnrolledCourseCard";
import "./user-course.css";

const UserCourse = ({ recordedCourse = [], liveCourse = [] }) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (recordedCourse.length == 0 && liveCourse.length > 0) {
      return "live";
    }
    return "recorded";
  });

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="purchase-course">
      <ContainerHeader title={"আমার কোর্সগুলি"}>
        <div className="tabs">
          <div
            className={`tab btn ${activeTab === "recorded" ? "active" : ""}`}
            onClick={() => changeTab("recorded")}
          >
            রেকর্ডেড কোর্স
          </div>
          <div
            className={`tab btn ${activeTab === "live" ? "active" : ""}`}
            onClick={() => changeTab("live")}
          >
            লাইভ কোর্স
          </div>
        </div>
      </ContainerHeader>
      <hr />
      <div
        className={`flex content ${activeTab === "recorded" ? "active" : ""}`}
      >
        {recordedCourse.length > 0 ? (
          recordedCourse.map((course) => (
            <EnrolledCourseCard
              key={Math.random() + course.id}
              course={{ ...course?.course }}
            />
          ))
        ) : (
          <div className="empty-course full-width">
            <p className="center" data-land="en">
              You did not enroll any course yet !{" "}
            </p>
          </div>
        )}
      </div>
      <div className={`flex content ${activeTab === "live" ? "active" : ""}`}>
        {liveCourse.length > 0 ? (
          liveCourse.map((course) => (
            <EnrolledCourseCard
              key={Math.random() + course.id}
              course={{ ...course?.course }}
            />
          ))
        ) : (
          <div className="empty-course full-width">
            <p className="center" data-land="en">
              You did not enroll any course yet !{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCourse;
