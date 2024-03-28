import LinkButton from "../button/LinkButton";
import "./facilities.css";
const Facilities = () => {
  return (
    <section className="section-live-course-facilities">
      <div className="container">
        <div className="course-facilities-content flex rainbow-banner">
          <div className="blur-circle blur-circle-yellow" />
          <div className="blur-circle blur-circle-blue" />
          <div className="blur-circle blur-circle-purple" />
          <div className="facilities-content-left">
            <div className="text-area">
              <h2>
                আমাদের লাইভ কোর্সে{" "}
                <span className="text-primary">কি কি পাচ্ছেন</span>
              </h2>
              <p className="banner-text">
                আপনার স্কিলকে প্রফেশনাল লেভেলে নিতে আমাদের লাইভ কোর্সে <br />{" "}
                আপনাদেরকে কি দিচ্ছি দেখে নিন ।
              </p>
              <LinkButton url={"/courses"} text={"সকল কোর্স দেখুন"} />
            </div>
            <div className="banner-image-container">
              {/* <Image src={'/facilities-girl.png'} height={452} width={654} alt="a girl with laptop" /> */}
              <img className="banner-image" src="/relax-girl.png" alt="" />
              <img
                className="banner-image-shape"
                src="/banner-shape-2.svg"
                alt="banner"
              />
            </div>
          </div>
          <div className="facilities-content-right">
            {/* <div className="text-card">
              <div className="text-card-icon">
                <div className="text-card-circle online-education">
                  <img src="/online.svg" alt="" />
                </div>
                <img
                  className="text-card-back-icon"
                  src="/education-back-icon.svg"
                  alt="banner"
                />
              </div>
              <p className="text-card-text">
                আপনার মেধা যাচাইয়ের জন্য সকল কোর্সে পাচ্ছেন কুইজ ও এক্সামের
                সুবিধা।
              </p>
            </div> */}
            <div className="text-card">
              <div className="text-card-icon">
                <div className="text-card-circle online-exam">
                  <img src="/exam-2.svg" alt="" />
                </div>
                <img
                  className="text-card-back-icon"
                  src="/exam-back-icon.svg"
                  alt="banner"
                />
              </div>
              <p className="text-card-text">
                আপনার মেধা যাচাইয়ের জন্য সকল কোর্সে পাচ্ছেন কুইজ ও এক্সামের
                সুবিধা।
              </p>
            </div>
            {/* <div className="text-card">
              <div className="text-card-icon">
                <div className="text-card-circle icon-lifetime">
                  <img src="/lifetime.svg" alt="" />
                </div>
                <img
                  className="text-card-back-icon"
                  src="/lifetime-back-icon.svg"
                  alt="banner"
                />
              </div>
              <p className="text-card-text">
                আপনার সফট-স্কিল বৃদ্ধি থেকে শুরু করে ক্যারিয়ার ডেভেলপমেন্ট করতে
                মানসম্পন্ন এ-টু-জেড সিলেবাস
              </p>
            </div> */}
            <div className="text-card">
              <div className="text-card-icon">
                <div className="text-card-circle icon-skill">
                  <img src="/skills.svg" alt="" />
                </div>
                <img
                  className="text-card-back-icon"
                  src="/skill-back-icon.svg"
                  alt="banner"
                />
              </div>
              <p className="text-card-text">
                আপনার সফট-স্কিল বৃদ্ধি থেকে শুরু করে ক্যারিয়ার ডেভেলপমেন্ট করতে
                মানসম্পন্ন এ-টু-জেড সিলেবাস।
              </p>
            </div>
            <div className="text-card">
              <div className="text-card-icon">
                <div className="text-card-circle icon-skill">
                  <img src="/online.svg" alt="" />
                </div>
                <img
                  className="text-card-back-icon"
                  src="/education-back-icon.svg"
                  alt="banner"
                />
              </div>
              <p className="text-card-text">
                টপ রেটেড ফ্রিল্যান্সারদের নিয়ে গঠিত টিচার প্যানেল, যাদের থেকে
                পাবেন সবগুলো লাইভ ক্লাসে সঠিক দিকনির্দেশনা।
              </p>
            </div>
            <div className="text-card">
              <div className="text-card-icon">
                <div className="text-card-circle icon-skill">
                  <img src="/lifetime.svg" alt="" />
                </div>
                <img
                  className="text-card-back-icon"
                  src="/lifetime-back-icon.svg"
                  alt="banner"
                />
              </div>
              <p className="text-card-text">
                লাইফ টাইম সাপোর্ট এবং ইনকামের সুনিশ্চিত পথ খুজে পাওয়ার শতভাগ
                নিশ্চিয়তা।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
