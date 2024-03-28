import LinkButton from "../button/LinkButton";
import "./sidebar-add.css";

const SidebarAdd = ({ title }) => {
  return (
    <div className="banner-add">
      <div className="text">
        <h3>{title || "প্রফেশনাল ফ্রি সিপিএ মার্কেটিং"}</h3>
        <LinkButton text={"এখনই শুরু করুন "} url={"/free-class-registration"} />
      </div>
      <div className="sidebar-add-img">
        <img src="/instruction.png" alt="instruction" />
      </div>
    </div>
  );
};

export default SidebarAdd;
