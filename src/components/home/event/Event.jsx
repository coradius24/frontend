"use client";
import LinkButton from "@/components/button/LinkButton";
import apiService from "@/services/api/apiService";
import { checkLang } from "@/utils/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./event.css";
const Event = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    apiService
      .get("/api/gallery/albums?limit=9&page=1")
      .then((data) => {
        setEvents(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePrefetch = () => {
    router.prefetch("/events");
  };

  const handleOnclick = () => {
    router.push("/events?page=1&limit=10");
  };
  if(events?.length === 0) return null

  return (
    <section className="section-event-gallery">
      <div className="container">
        <div className="event-gallery-content rainbow-banner">
          <div className="blur-circle blur-circle-yellow" />
          <div className="blur-circle blur-circle-yellow  blur-circle-yellow-2" />
          <div className="blur-circle blur-circle-green" />
          <div className="blur-circle blur-circle-purple" />
          <div className="blur-circle blur-circle-sky" />
          <div className="gallery-header flex align-center">
            <h2>
              অফিসিয়াল ইভেন্ট <br />
              <span className="text-primary"> ছবির গ্যালারি</span>
            </h2>
            <div className="courses-header-btn">
              <LinkButton
                url={"/events?page=1&limit=16"}
                text={"সকল ইভেন্ট দেখুন "}
              />
            </div>
          </div>
          <div className="event-gallery">
            <div className="event-gallery-row event-gallery-row_top flex">
              {events?.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="gallery-card"
                  onMouseEnter={handlePrefetch}
                >
                  <Image
                    height={233}
                    width={316}
                    src={event.thumbnail}
                    alt={event.name}
                  />
                  <div className="gallery-card-info-container d-flex">
                    <div className="gallery-card-info">
                      <h6 data-lang={checkLang(event.name)}>{event.name}</h6>
                      <p data-lang={checkLang(event.shortDescription)}>
                        {event.shortDescription}
                      </p>
                      <button
                        className="btn event-btn"
                        type="button"
                        onClick={handleOnclick}
                      >
                        সকল ছবি দেখুন
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10.8333 5.8335L15 10.0002M15 10.0002L10.8333 14.1668M15 10.0002H5"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="event-gallery-row event-gallery-row-2 d-flex small-hide medium-hide">
              {events?.slice(4, 9).map((event) => (
                <div
                  className="gallery-card"
                  key={event.id}
                  onMouseEnter={handlePrefetch}
                >
                  <Image
                    height={233}
                    width={316}
                    src={event.thumbnail}
                    alt={event.name}
                  />
                  <div className="gallery-card-info-container d-flex">
                    <div className="gallery-card-info">
                      <h6 data-lang={checkLang(event.name)}>{event.name}</h6>
                      <p data-lang={checkLang(event.shortDescription)}>
                        {event.shortDescription}
                      </p>
                      <button
                        className="btn event-btn"
                        type="button"
                        onClick={handleOnclick}
                      >
                        সকল ছবি দেখুন
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10.8333 5.8335L15 10.0002M15 10.0002L10.8333 14.1668M15 10.0002H5"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Event;
