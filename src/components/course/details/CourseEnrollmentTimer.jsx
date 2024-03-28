import LiveClassTimer from "@/app/(student-portal)/dashboard/live-class/LiveClassTimer";
import { formatDateInBengali } from "@/utils/lib";
import { HiOutlineCalendar } from "react-icons/hi";
import "./courseEnrollmentTimer.css";

const CourseEnrollmentTimer = ({ course }) => {
  return (
    <div className="enrollment__timer-wrapper flex">
      <div className="enrollment__timer flex">
        <span>ভর্তি শেষ হতে বাকি</span>
        <LiveClassTimer date={course.enrollmentDeadline} />
      </div>
      <div className="class-schedule flex">
        <div className="enrollment-end-date">
          <div className="flex align-center">
            {" "}
            <span>
              {" "}
              <HiOutlineCalendar color="#19891C" size={14} />
            </span>
            <span> ভর্তি শেষ</span>
          </div>
          <span>
            {formatDateInBengali(course.enrollmentDeadline || new Date())}
          </span>
        </div>
        <div className="dotted"></div>
        <div className="class-start-date">
          <div className="flex align-center">
            {" "}
            <span>
              <HiOutlineCalendar color="#19891C" size={14} />
            </span>
            <span>ক্লাস শিডিউল</span>
          </div>
          <span>{course.scheduleText}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollmentTimer;
