"use client";
import CustomAccordion, { CustomAccordionItem } from "@/components/Accordion";
import { updateSectionWithWatchHistory } from "@/utils/lib";
import { useRouter } from "next/navigation";
import "./module.css";

const Module = ({
  courseSection,
  currentLesson,
  watchHistory = [],
  enableDripContent = false,
  previousLesson,
  previewKey,
}) => {
  const router = useRouter();
  let data = courseSection || [];
  if (enableDripContent) {
    const { isValid, updatedData } = updateSectionWithWatchHistory(
      data,
      watchHistory,
      previousLesson
    );
    if (!isValid) {
      return router.push("/dashboard/courses");
    }
    data = updatedData;
  }
  const courseId = courseSection[0]?.courseId ?? null;

  return (
    <div className="video-play-course-module">
      <div className="module-search">
        <input
          type="text"
          placeholder={"আপনার লেকচারটি সার্চ করুন "}
          autoComplete="false"
        />
        <span className="search-icon">
          <img src="/search.svg" alt="search-icon" />
        </span>
      </div>
      <div className="module">
        <CustomAccordion preExpandedId={currentLesson.sectionId}>
          {data?.map((item) => (
            <CustomAccordionItem
              key={item.id}
              courseId={courseId}
              link={!enableDripContent}
              currentLesson={currentLesson}
              previewKey={previewKey}
              item={{
                id: item.id,
                heading: item.title,
                content: item.lessons,
              }}
            />
          ))}
        </CustomAccordion>
        <div className="shadow"></div>
      </div>
    </div>
  );
};

export default Module;
