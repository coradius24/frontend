"use client";
import CourseCurriculum from "@/components/course/CourseCurriculum";
import { updateSectionWithWatchHistory } from "@/utils/lib";
import { useState } from "react";
import Assignment from "./Assignment";
import ToolsItem from "./ToolsItem";
import "./course-tab.css";

const CourseNav = ({
  courseSection = [],
  courseId,
  tools = [],
  invoiceOfTheCourse,
  watchHistory = [],
  enableDripContent = false,
}) => {
  let data = courseSection;
  if (enableDripContent) {
    const { updatedData } = updateSectionWithWatchHistory(
      courseSection,
      watchHistory
    );
    data = updatedData;
  }
  const tabs = [
    { label: "কারিকুলাম", id: "curriculum" },
    { label: "রিসোর্স & টুলস", id: "resource&tools" },
    { label: "এসাইনমেন্ট", id: "assignment" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="tab-container">
      <div className="tab-list flex">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab.id === tab.id ? "active" : ""}`}
            onClick={() => changeTab(tab)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="content">
        {activeTab.id == "curriculum" && (
          <CourseCurriculum
            link={!enableDripContent}
            courseId={courseId}
            courseSection={data}
          />
        )}
        {activeTab.id == "resource&tools" && (
          <ToolsItem
            courseId={courseId}
            invoiceOfTheCourse={invoiceOfTheCourse}
            tools={tools}
          />
        )}
        {activeTab.id == "assignment" && <Assignment />}
      </div>
    </div>
  );
};

export default CourseNav;
