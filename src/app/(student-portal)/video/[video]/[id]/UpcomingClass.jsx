"use client";
import useApp from "@/hooks/useApp";
import { useEffect, useState } from "react";
import "./upcoming-class.css";

const UpcomingClass = ({ courseId }) => {
  const { liveClasses } = useApp();
  const [data, setData] = useState({});

  useEffect(() => {
    const item = liveClasses.find(
      (item) => item.courseId === parseInt(courseId)
    );
    if (item) {
      setData(item);
    }
  }, [courseId, liveClasses]);

  return (
    <div className="upcoming-class">
      <p>এই ক্লাসটি এখনো হয়নি !</p>
    </div>
  );
};

export default UpcomingClass;
