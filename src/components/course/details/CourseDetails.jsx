import CustomAccordion, { CustomAccordionItem } from "@/components/Accordion";
import StarRating from "@/components/StarRating";
import { checkLang } from "@/utils/lib";
import { BsFillCheckCircleFill } from "react-icons/bs";
import CourseCurriculum from "../CourseCurriculum";
import CourseEnrollmentTimer from "./CourseEnrollmentTimer";
import CourseCard from "./CourseSidebar";
import InstructorList from "./InstructorList";
import "./courseContent.css";
import "./courseDetails.css";
import Review from "./review/Review";

const CourseDetails = ({ course, courseSection = [] }) => {
  let allLessons = courseSection?.map((item) => item.lessons);
  allLessons = [].concat(...allLessons);
  const {
    outcomes,
    requirements,
    faqs,
    instructor,
    coInstructors,
    rating,
    rattedBy,
  } = course;
  const isSingleRow = requirements?.length < 2;
  return (
    <section className="course-content-area">
      <div className="container">
        <div className="content flex">
          <div className="course-curriculum">
            {course.contentType === "live" && (
              <CourseEnrollmentTimer course={course} />
            )}
            <h2 className="section-title">এই কোর্স থেকে কী কী শিখবেন?</h2>
            <hr />
            <div className="content-box">
              <ul>
                {outcomes.map((item) => {
                  const lang = checkLang(item);
                  return (
                    <li key={item} data-lang={lang}>
                      <div className="icon">
                        <BsFillCheckCircleFill />
                      </div>
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="course-curriculum-box">
              <div className="course-curriculum-title flex">
                <h2 className="section-title">কোর্সের পরিপূর্ণ কারিকুলাম</h2>
                <hr />
              </div>
              {courseSection?.length > 0 && (
                <CourseCurriculum courseSection={courseSection} />
              )}
            </div>
            {requirements?.length > 0 && (
              <>
                <h2 className="section-title">
                  কোর্সটি করার জন্য আপনাকে যা জানা থাকা প্রয়োজন
                </h2>
                <hr />
                <div className="content-box">
                  <ul>
                    {requirements.map((item) => {
                      const lang = checkLang(item);
                      return (
                        <li
                          key={item}
                          className={`${isSingleRow ? "single" : ""}`}
                          data-lang={lang}
                        >
                          <div className="icon">
                            <BsFillCheckCircleFill />
                          </div>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}

            {Object.keys(faqs).length > 0 && (
              <>
                <h2 className="section-title course-faq-title">
                  অনলাইন কোর্স সম্পর্কে সকল প্রশ্ন
                </h2>
                <hr />
                <div className="course-faq course-curriculum-accordion">
                  <CustomAccordion>
                    {Object.keys(faqs).map((key, i) => (
                      <CustomAccordionItem
                        key={i}
                        item={{
                          id: i,
                          heading: key,
                          content: faqs[key],
                        }}
                      />
                    ))}
                  </CustomAccordion>
                </div>
              </>
            )}
            <h2 className="section-title instructor">আপনার ইন্সট্রাক্টর</h2>
            <hr />
            <div className="course-instructors">
              <div className="about-instructor-box flex">
                <InstructorList
                  instructors={[instructor, ...coInstructors?.slice(0, 2)]}
                />
              </div>
            </div>
            <div className="student-feedback-box">
              <p className="student-feedback-title">ছাত্র প্রতিক্রিয়া</p>
              <div className="review-content flex">
                <div className="average-rating">
                  <div className="num">{rating}</div>
                  <div className="rating">
                    <StarRating filledStars={rating} fillFromStart={true} />
                  </div>
                  <div className="title">({rattedBy} রিভিউ)</div>
                </div>
                <div className="individual-rating">
                  <ul>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <li key={item}>
                        <div>
                          <StarRating
                            filledStars={item}
                            fillFromStart={false}
                          />
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{ width: "0%" }}
                          />
                        </div>
                        <span className="count">0</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <CourseCard course={course} />
        </div>
      </div>
      <div className="course-review">
        <Review />
      </div>
    </section>
  );
};

export default CourseDetails;
