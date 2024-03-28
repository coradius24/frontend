import SidebarAdd from "../add-banner/SidebarAdd";
import LinkButton from "../button/LinkButton";
import "./course-banner.css";

const CourseBanner = ({ title = "প্রফেশনাল ফ্রি সিপিএ মার্কেটিং" }) => {
  return (
    <>
      <section className="success-marketing small-hide medium-hide">
        <div className="container">
          <div className="marketing-content flex">
            <div className="content-image small-hide">
              <img src="/desktop.png" alt="guideline" />
            </div>
            <div className="content-text center">
              <h3>{title}</h3>
              <LinkButton
                url={`/free-class-registration`}
                text={"এখনই শুরু করুন"}
              />
            </div>
            <div className="content-image second">
              <img src="/instruction.png" alt="instruction" />
            </div>
          </div>
        </div>
      </section>
      <div className="container large-up-hide">
        <SidebarAdd title={title} />
      </div>
    </>
  );
};

export default CourseBanner;
