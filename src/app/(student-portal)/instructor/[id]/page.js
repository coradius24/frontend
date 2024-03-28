import HeroBanner from "@/components/HeroBanner";
import { GetLink } from "@/components/instructor/InstructorItem";
import { baseURL } from "@/services/api/apiService";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { TiSocialFacebook } from "react-icons/ti";
import InstructorCourses from "./InstructorCourses";
import "./page.css";
import UserPhoto from "/public/user.png";

async function fetchInstructor(id) {
  try {
    const res = await fetch(`${baseURL}/api/users/instructor/${id}`, {
      cache: "reload",
    });
    if (res.ok) {
      return res.json();
    }
    return {};
  } catch (error) {
    return {};
  }
}

export async function generateMetadata({ params }) {
  const id = params.id;
  const res = await fetch(`${baseURL}/api/users/instructor/${id}`).then((res) =>
    res.json()
  );
  if (!res) {
    return {
      title: "Instructors",
      description: "about instructors",
      generator: "UpSpot Academy",
      applicationName: "UpSpot Academy",
      authors: [{ name: "Ashraful Islam" }],
      creator: "UpSpot Academy",
      publisher: "UpSpot Academy",
    };
  }

  return {
    title: res.fullName,
    generator: "UpSpot Academy",
    applicationName: "UpSpot Academy",
    authors: [{ name: "Ashraful Islam" }],
    creator: "UpSpot Academy",
    publisher: "UpSpot Academy",
  };
}

const Instructor = async ({ params }) => {
  const instructorData = await fetchInstructor(params.id);
  if (!instructorData.id) {
    return redirect("/");
  }
  const {
    fullName,
    profile,
    studentCount,
    reviews,
    courseCount,
    photo,
    federated,
  } = instructorData;
  let profileImage = photo?.url || federated?.picture;
  let skills = profile?.skills || "";
  let socialLinks = profile?.socialLinks || {};
  skills =
    skills.length > 1 && skills?.split(",").sort((a, b) => a.length - b.length);

  return (
    <HeroBanner className="instructor">
      <div className="content flex">
        <aside className="sidebar profile">
          <div className="profile__info">
            <div className="profile__photo">
              <Image
                src={profileImage || UserPhoto}
                height={180}
                width={180}
                alt="instructor profile"
              />
            </div>
            <h2>{fullName}</h2>
            <p>{profile?.title}</p>
          </div>
          <div className="profile__about">
            <h3>About</h3>
            <div
              dangerouslySetInnerHTML={{ __html: profile?.biography || "" }}
            ></div>
          </div>
          <div className="profile__skills">
            <h3>Skills</h3>
            <div className="profile__skills-items">
              {skills.length > 0 &&
                skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </div>
          <div className="sidebar-bottom">
            <div>
              <span>Total Course:</span>{" "}
              <span>{courseCount >= 10 ? courseCount : `0${courseCount}`}</span>
            </div>
            <div>
              <span>Reviews:</span> <span>{reviews}+</span>
            </div>
            <div>
              <span>Total Student:</span> <span>{studentCount}+</span>
            </div>
            <div>
              <div className="social-links">
                <GetLink link={socialLinks?.facebook}>
                  <TiSocialFacebook size={16} />
                </GetLink>
                <GetLink link={socialLinks?.twitter}>
                  <AiOutlineTwitter size={16} />
                </GetLink>
                <GetLink link={socialLinks?.linkedin}>
                  <FaLinkedinIn size={16} />
                </GetLink>
              </div>
            </div>
          </div>
        </aside>
        <div className="main-content">
          <div className="main-content-header">
            <h1>
              {fullName} এর <span className="text-primary">কোর্স গুলো</span>
            </h1>
          </div>
          <InstructorCourses />
        </div>
      </div>
    </HeroBanner>
  );
};

export default Instructor;
