"use client";
import { useEffect, useState } from "react";
import "./live-class.css";

const LiveClassTimer = ({ date }) => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const eventDate = new Date(date);

    const difference = eventDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    } else {
      // Event has already occurred
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="live-class-timer flex">
      <div className="live-class-timer-item day">
        <span>{time.days}</span>
        <span>দিন</span>
      </div>
      <div className="live-class-timer-item hour">
        <span>{time.hours}</span>
        <span>ঘন্টা</span>
      </div>
      <div className="live-class-timer-item minute">
        <span>{time.minutes}</span>
        <span>মিনিট</span>
      </div>
      <div className="live-class-timer-item second">
        <span>{time.seconds}</span>
        <span>সেকেন্ড</span>
      </div>
    </div>
  );
};

export default LiveClassTimer;
