import CustomAccordion, { CustomAccordionItem } from "../Accordion";
import "./course-curriculum-accordion.css";

const CourseCurriculum = ({
  courseSection = [],
  className = "",
  courseId,
  link = false,
}) => {
  return (
    <div className={`course-curriculum-accordion ${className}`}>
      <CustomAccordion preExpandedId={courseSection?.[0]?.id}>
        {courseSection?.map((item) => (
          <CustomAccordionItem
            courseId={courseId}
            key={item.id}
            link={link}
            item={{
              id: item.id,
              heading: item.title,
              content: item.lessons,
            }}
          />
        ))}
      </CustomAccordion>
    </div>
  );
};

export default CourseCurriculum;
