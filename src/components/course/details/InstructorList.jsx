import { GetLink } from "@/components/instructor/InstructorItem";
import Image from "next/image";
import { FaFacebookF, FaLinkedin, FaTwitter } from "react-icons/fa6";
import "./course-details-instructor.css";

const InstructorList = ({ instructors = [] }) => {
  return instructors.map((item) => (
    <InstructorListItem item={item} key={item.id} />
  ));
};

export default InstructorList;

const InstructorListItem = ({ item }) => {
  const { fullName, title, photo } = item;
  return (
    <div className="course-details-instructor">
      <div className="top-aria">
        <div className="avatar-bg"></div>
        <div className="avatar">
          <Image
            height={119}
            width={119}
            src={photo || "/menotr-1.png"}
            alt={fullName}
          />
        </div>
      </div>
      <div className="profile">
        <p className="name">{fullName}</p>
        <p className="role">{title || "Instructor"}</p>
        <div className="socials flex">
          <div className="item">
            <GetLink link={"socialLinks.facebook"}>
              <FaFacebookF size={12} />
            </GetLink>
          </div>
          <div className="item">
            <GetLink link={"socialLinks.facebook"}>
              <FaTwitter size={12} />
            </GetLink>
          </div>
          <div className="item">
            <GetLink link={"socialLinks.facebook"}>
              <FaLinkedin size={12} />
            </GetLink>
          </div>
        </div>
      </div>
    </div>
  );
};
