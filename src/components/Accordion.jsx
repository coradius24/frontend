"use client";
import { checkLang, formatDuration } from "@/utils/lib";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { MdPlayCircle } from "react-icons/md";
import "./accordion.css";

const CustomAccordion = ({ children, preExpandedId, className = "" }) => {
  return (
    <Accordion className={className} preExpanded={[preExpandedId]}>
      {children}
    </Accordion>
  );
};

export default CustomAccordion;

export const CustomAccordionItem = ({
  item = { id: "", heading: "", content: "" },
  children,
  link = false,
  courseId = 0,
  currentLesson,
  previewKey = "",
}) => {
  let lectureCount = true;
  if (typeof item.content === "string") {
    lectureCount = false;
  }
  const lang = checkLang(item.heading);
  return (
    <AccordionItem uuid={item.id}>
      <AccordionItemHeading>
        <AccordionItemButton data-lang={lang}>
          {item.heading}
          {lectureCount && item.content && (
            <span className="lecture-count">
              {" "}
              <span className="number">{getNumber(item.content)}</span> লেকচার
            </span>
          )}
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {children ? (
          children
        ) : (
          <GetContent
            sectionId={item.id}
            content={item.content}
            link={link}
            courseId={courseId}
            currentLesson={currentLesson}
            previewKey={previewKey}
          />
        )}
      </AccordionItemPanel>
    </AccordionItem>
  );
};

const GetContent = ({
  content = [],
  link,
  courseId,
  currentLesson = {},
  previewKey = "",
}) => {
  if (typeof content === "string") {
    const lang = checkLang(content);
    return <span data-lang={lang}>{content}</span>;
  }
  return (
    <ul className="lecture-list">
      {content &&
        content?.map((lesson) => {
          const lang = checkLang(lesson.title);
          return (
            <li
              className={`lecture has-preview flex ${
                currentLesson.id === lesson.id ? "active" : ""
              }`}
              data-lang={lang}
              key={lesson.id}
            >
              {link || lesson.isLink ? (
                <Link
                  href={`/video/${courseId}/${lesson.id}${
                    previewKey ? `?previewKey=${previewKey}` : ""
                  }`}
                >
                  <span className="lecture-title flex align-center">
                    <MdPlayCircle size={18} /> <span>{lesson.title}</span>
                  </span>
                  <div className="lecture-info float-lg-end">
                    <span className="lecture-time ps-2">
                      {formatDuration(lesson.durationInSecond)}
                    </span>
                  </div>
                </Link>
              ) : (
                <>
                  <span className="lecture-title flex align-center">
                    <MdPlayCircle size={18} /> <span>{lesson.title}</span>
                  </span>
                  <div className="lecture-info float-lg-end">
                    <span className="lecture-time ps-2">
                      {formatDuration(lesson.durationInSecond)}
                    </span>
                  </div>
                </>
              )}
            </li>
          );
        })}
    </ul>
  );
};

function getNumber(content) {
  let length = content.length;
  if (content.length > 9) {
    return length;
  }
  return `0${length}`;
}
