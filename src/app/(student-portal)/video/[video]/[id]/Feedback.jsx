import LinkButton from "@/components/button/LinkButton";
import VideoPlayer from "./VideoPlayer";
import "./feedback.css";

const Feedback = ({ currentLesson, setPlayer, updateWatchTime }) => {
  const reviewLink = btoa(JSON.stringify({ courseId: currentLesson.courseId }));
  return (
    <>
      <VideoPlayer
        updateWatchTime={updateWatchTime}
        currentLesson={currentLesson}
        setPlayer={setPlayer}
      />
      <div className="video-summary">
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
      <div className="feedback-bottom">
        <div className="flex">
          <div>
            <p className="text-primary">
              আপনি কি ভাবে ভিডিও তৈরি করবেন সে জন্য উপরের ভিডিও-টি দেখুন{" "}
            </p>
          </div>
          <LinkButton
            url={`/reviews/create?review=${reviewLink}`}
            text={"রিভিউ দিন"}
          />
        </div>
      </div>
    </>
  );
};

export default Feedback;
