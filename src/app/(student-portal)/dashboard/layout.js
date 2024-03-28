import BackButton from "@/components/dashboard/BackButton";
import Header from "@/components/dashboard/Header";
import Navigation from "@/components/dashboard/Navigation";
import { DashboardLogout } from "@/components/header/SignOut";
import myFeatureService from "@/services/myFeatureService";
import { formatMyFeatures } from "@/utils/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AiOutlineDollarCircle,
  AiOutlineUser,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdOutlineHistory } from "react-icons/md";
import ProfileImage from "./ProfileImage";
import "./dashboard.css";

export default async function Layout({ children }) {
  const access_token = cookies().get("access_token")?.value;
  if (!access_token) {
    return redirect("/");
  }
  const myFeature = await myFeatureService.getMyFeature(access_token);
  const availableFeature =
    formatMyFeatures(myFeature)["studentDashboardSidebar"];
  return (
    <>
      <Header />
      <section className="user-dashboard-area">
        <div className="container">
          <div className="flex">
            <aside className="user-dashboard-sidebar flex">
              <div className="sidebar-top">
                <ProfileImage />
                <div className="user-dashboard-menu">
                  <ul>
                    <Navigation
                      navLinks={links}
                      availableFeature={availableFeature}
                    />
                  </ul>
                </div>
              </div>
              <DashboardLogout />
            </aside>
            <div className="main-content">
              {children}
              <BackButton />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/**
  label: Link text
  path: it will be /dashboard/path
      ex: /dashboard/notifications
  if exclude true /dashboard will not append with path
  text: This text will be show on header banner top of dashboard page
  icon: font awesome icon class
 */

export const links = [
  {
    label: "নোটিশবোর্ড",
    path: "notices",
    icon: <HiOutlineSpeakerphone size={20} />,
    text: "আমার কোর্স",
  },
  {
    label: "আমার কোর্স",
    path: "courses",
    icon: <BsCardChecklist size={20} />,
    text: "আমার কোর্স",
  },
  {
    label: "ক্লাস জয়েনিং",
    path: "live-class",
    icon: <AiOutlineVideoCameraAdd size={20} />,
  },
  {
    label: "পার্চেস হিস্ট্রি",
    path: "purchase-history",
    icon: <MdOutlineHistory size={20} />,
  },
  {
    label: "স্মার্টলিংক ও আর্নিং রিপোর্ট",
    id: "student_earning_report",
    path: "earning-report",
    icon: <AiOutlineDollarCircle size={20} />,
  },
  {
    label: "আমার ওয়ালেট",
    path: "wallet",
    id: "student_wallet",
    icon: <AiOutlineDollarCircle size={20} />,
  },
  {
    label: "আমার প্রোফাইল",
    path: "profile",
    icon: <AiOutlineUser size={20} />,
    text: "User profile",
  },
];
