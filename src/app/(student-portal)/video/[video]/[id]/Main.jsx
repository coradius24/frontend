"use client";
import ContainerHeader from "@/components/dashboard/ContainerHeader";
import courseService from "@/services/courseService";
import { useEffect, useRef, useState } from "react";
import Article from "./Article";
import Buttons from "./Buttons";
import Feedback from "./Feedback";
import Module from "./Module";
import UpcomingClass from "./UpcomingClass";
import VideoPlayer from "./VideoPlayer";

function calculateTotalDifference(data) {
  try {
    return data.reduce((totalDifference, [startTime, endTime]) => {
      if (isNaN(startTime) || isNaN(endTime)) {
        console.log("Invalid time format");
        return 0;
      }

      return totalDifference + (endTime - startTime);
    }, 0);
  } catch (error) {
    console.error("Error calculating total difference:", error.message);
    return 0; // Default to 0 in case of errors
  }
}

const Main = ({
  currentLesson,
  allLessons,
  data,
  currentSection,
  courseId,
  watchHistory = [],
  previousLesson,
  enableDripContent = false,
  previewKey,
}) => {
  const { videoType, id } = currentLesson;
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleInspectElement = (event) => {
      if (
        event.keyCode === 123 || // F12 key
        (event.ctrlKey && event.shiftKey && event.keyCode === 73) // Ctrl+Shift+I
      ) {
        event.preventDefault();
      }
    };

    const handleMouseEvents = () => {
      // Capture various mouse events
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleInspectElement);
    window.addEventListener("mousemove", handleMouseEvents);
    window.addEventListener("mousedown", handleMouseEvents);
    window.addEventListener("mouseup", handleMouseEvents);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleInspectElement);
      window.removeEventListener("mousemove", handleMouseEvents);
      window.removeEventListener("mousedown", handleMouseEvents);
      window.removeEventListener("mouseup", handleMouseEvents);
    };
  }, []);

  const youtubeRef = useRef(null);
  const [timeWatched, setTimeWatched] = useState(0);

  const [player, setPlayer] = useState(null);

  const updateWatchTime = (time) => {
    setTimeWatched(time);
  };

  const handleWatchTime = async () => {
    return; // disable enable drip content but still keeping code so that in future they can use it
    if (!enableDripContent) {
      return true;
    }
    try {
      if (videoType === "customUrl") {
        if (timeWatched > 0) {
          await courseService.watchHistory({
            lessonId: id,
            watchTimeInSecond: parseInt(timeWatched),
          });
        }
      } else if (videoType === "YouTube") {
        if (youtubeRef.current) {
          const watchTime = youtubeRef.current.getCurrentTime();
          await courseService.watchHistory({
            lessonId: id,
            watchTimeInSecond: parseInt(watchTime),
          });
        }
      } else if (videoType === "vimeo" && player) {
        player
          .getPlayed()
          .then(async (played) => {
            await courseService.watchHistory({
              lessonId: id,
              watchTimeInSecond: parseInt(calculateTotalDifference(played)),
            });
          })
          .catch((error) => {
            console.log({ error });
          });
      }
      return "Success";
    } catch (error) {
      console.log({ error });
      throw error;
    }
  };

  let lessonContent = null;
  if (currentLesson.lessonType === "upcomingLiveClass") {
    lessonContent = <UpcomingClass courseId={courseId} />;
  } else if (currentLesson.lessonType === "article") {
    lessonContent = <Article currentLesson={currentLesson} />;
  } else if (currentLesson.lessonType === "feedback") {
    lessonContent = (
      <Feedback
        ref={youtubeRef}
        updateWatchTime={updateWatchTime}
        setPlayer={setPlayer}
        currentLesson={currentLesson}
      />
    );
  } else {
    lessonContent = (
      <VideoPlayer
        ref={youtubeRef}
        updateWatchTime={updateWatchTime}
        setPlayer={setPlayer}
        currentLesson={currentLesson}
      />
    );
  }
  return (
    <div className="content">
      <ContainerHeader title={currentLesson?.title}>
        <strong>{currentSection.title}</strong>
      </ContainerHeader>
      <div className="course-video-player flex">
        <div className="player-aria">
          {lessonContent}
          {currentLesson.lessonType !== "feedback" && (
            <div className="video-summary">
              <p>নোট </p>
              {currentLesson.summary && (
                <div className="video-summary-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentLesson.summary,
                    }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="module">
          {
            <Module
              previousLesson={previousLesson}
              watchHistory={watchHistory}
              enableDripContent={enableDripContent}
              courseSection={data}
              currentLesson={currentLesson || {}}
              previewKey={previewKey}
            />
          }
          <Buttons
            allLessons={allLessons}
            currentLesson={currentLesson}
            handleWatchTime={handleWatchTime}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
