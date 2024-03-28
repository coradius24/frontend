import Image from "next/image";
import Link from "next/link";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { TiSocialFacebook } from "react-icons/ti";
import "./instructor-item.css";

const InstructorItem = ({ data = {}, type = false }) => {
  const { fullName, profile, id, photo, federated } = data;
  let profileImage = photo?.url || federated?.picture;
  const { socialLinks, title } = profile || {};

  return (
    <div className="mentor-image-card">

      {type ? (
        <Image width={307} height={362} src={profileImage ? profileImage : "/menotr-1.png"} alt="mentor" />
      ) : (
        <Link href={`/instructor/${id}`}>
           <Image width={307} height={362} src={profileImage ? profileImage : "/menotr-1.png"} alt="mentor" />

        </Link>
      )}
      <div className="mentor-info-bar" />
      <div className="mentor-info-container">
        <div className="mentor-info">
          <p className="mentor-name">{fullName}</p>
          <p className="mentor-position">{title ? title : "Instructor"}</p>
          <div className="social-links">
            <GetLink link={socialLinks?.facebook}>
              <TiSocialFacebook size={14} />
            </GetLink>
            <GetLink link={socialLinks?.twitter}>
              <AiOutlineTwitter size={14} />
            </GetLink>
            <GetLink link={socialLinks?.linkedin}>
              <FaLinkedinIn size={12} />
            </GetLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorItem;

export const GetLink = ({ link, children }) => {
  return (
    <Link
      scroll={false}
      href={link || "#"}
      target={link !== "#" ? "_blank" : "_self"}
    >
      {children}
    </Link>
  );
};
