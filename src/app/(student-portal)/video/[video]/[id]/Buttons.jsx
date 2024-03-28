"use client";
import { useRouter } from "next/navigation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
const Buttons = ({ allLessons, currentLesson }) => {
  const router = useRouter();
  const index = allLessons.findIndex((item) => item.id === currentLesson.id);
  const nextLesson = allLessons[index + 1];
  let previousLesson = allLessons[index - 1];

  if (index === 0 || index === -1) {
    previousLesson = null;
  }

  const handlePrevNext = async (id) => {
    router.push(`/video/${currentLesson.courseId}/${id}`);
  };

  return (
    <div className="course-video-buttons flex">
      <button
        disabled={!previousLesson}
        onClick={() => handlePrevNext(previousLesson.id)}
        className="btn previous event-btn"
        type="button"
      >
        <BiChevronLeft size={18} color="#3F403F" /> পূর্ববর্তী ক্লাস{" "}
      </button>

      <button
        disabled={!nextLesson}
        onClick={() => handlePrevNext(nextLesson.id)}
        className="btn next event-btn"
        type="button"
      >
        পরবর্তী ক্লাস <BiChevronRight size={18} color="#fff" />{" "}
      </button>
    </div>
  );
};

export default Buttons;
