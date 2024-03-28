import LinkButton from "@/components/button/LinkButton";
import VideoModal from "@/components/VideoModal";
import { MdPlayArrow } from "react-icons/md";
import "./about-us.css";
const AboutHero = () => {
  return (
    <section className="about-us rainbow-banner">
      <div className="ellipse-top-corner"></div>
      <div className="ellipse-right"></div>
      <div className="container">
        <div className="ellipse-top"></div>
        <div className="ellipse-top-right"></div>
        <div className="content flex">
          <div className="text-content">
            <h1>
              <span className="text-primary">আপস্পট একাডেমি</span> সম্পর্কে
            </h1>
            <p>
              আপস্পট একাডেমি এমন একটি প্রতিষ্ঠান, যেখানে ফ্রীল্যান্সিং কোর্স
              শিক্ষার একটি উন্নত মান দেয় এবং সম্প্রদায়কে ক্ষমতায়ন করে। এই
              প্রতিষ্ঠানের মাধ্যমে ছাত্র-ছাত্রীদের মাধ্যমে ফ্রীল্যান্সিং এর
              দুনিয়ায় প্রবেশ করানো হয় এবং তাদের ক্ষমতা এবং কার্যকরিতা বৃদ্ধি
              করা হয়। এই প্রতিষ্ঠানে শিক্ষক এবং উপাধ্যায়দের নির্দেশনা অনুসরণ করে ছাত্র-ছাত্রীদেরকে কাজের প্রাথমিক ধারণা দেয়া হয় এবং তাদেরকে বিভিন্ন ফ্রিল্যান্সিং প্ল্যাটফর্মে দক্ষ করে তোলা হয়।{" "}
            </p>
            <LinkButton
              url={"/free-class-registration"}
              text={"রেজিষ্ট্রেশন করুন"}
            />
          </div>
          <div className="image-container">
            <div className="images">
              <img src="/about.png" alt="about us" className="first-image" />
              <div className="second-box">
                <img
                  src="/about-2.png"
                  alt="about us"
                  className="second-image"
                />
                <VideoModal provider="vimeo" autoplay={false} videoId={'899416975'} >
                  <div className="play-icon">
                    <MdPlayArrow />
                  </div>
                </VideoModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;