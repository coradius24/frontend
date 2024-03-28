import LinkButton from "../button/LinkButton";
import "./hero.css";
const Hero = () => {
  return (
    <section className="section-banner rainbow-banner">
      <div className="ellipse-top-corner"></div>
      <div className="ellipse-right"></div>
      <div className="banner-content container flex">
        <div className="ellipse-top"></div>
        <div className="ellipse-top-right"></div>
        <div className="banner-text">
          <h1>
            বেকারত্ব দূর করতে যোগ দিন <br />{" "}
            <span className="text-primary">আমাদের ফ্রি ক্লাসে !</span>
          </h1>
          <p>
            বেকার বসে না থেকে আপনার হাতে থাকা ডিভাইসটি কাজে লাগিয়ে ইনকাম <br />{" "}
            শুরু করুন আমাদের গাইড লাইন ফলো করে।
          </p>
          <LinkButton
            url={"/free-class-registration"}
            text={"রেজিষ্ট্রেশন করুন"}
          />
        </div>
        <div className="banner-images">
          <div className="banner-image-container">
            <img className="hero-icons" fetchPriority="high" src={"/hero-icon.png"} alt="hero image" />
            <img className="hero-photo-bg" fetchPriority="high" src={"/hero-photo-bg.png"}  alt="hero image" />
            <img fetchPriority="high" className="hero-photo" src={"/hero-photo.png"} alt="hero image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
