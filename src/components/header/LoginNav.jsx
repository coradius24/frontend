import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import enrollmentService from "@/services/enrollmentService";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Script from "next/script";
import { AiOutlineUser } from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import {RiGraduationCapLine} from "react-icons/ri";
import LoginUserDropDown from "./LoginUserDropDown";
import NotificationDropdown from "./NotificationDropdown";
import ProfileImage from "./ProfileImage";
import SignOut from "./SignOut";
import "./login-nav.css";
import { cookies } from "next/headers";
import { baseURL } from "@/services/api/apiService";

const dropdownNavItem = [
  {
    href: "/dashboard/notices",
    text: "স্টুডেন্ট ড্যাশবোর্ড",
    icon: <RiGraduationCapLine size={20} />,
  },
  {
    href: "/dashboard/profile",
    text: "আমার প্রোফাইল",
    icon: <AiOutlineUser size={20} />,
  },
  {
      href: "/admin",
      text: "অ্যাডমিন পোর্টাল",
      icon: <RxDashboard size={20} />,
      isAdminOnly: true
  }
];

const LoginNav = async () => {
  const session = await getServerSession(authOptions);
  const access_token = cookies().get("access_token")?.value;

  let supportBoard;
  try {
    let response = await fetch(`${baseURL}/api/supports`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: {
        revalidate: 0,
      },
    });

    response = await response.json();
    if (response) {
      supportBoard = response;
    }
  } catch (error) {
  }

 
  return (
    <>
      <div className="login-user-nav flex align-items-center">
        <div>
          <NotificationDropdown />
        </div>
        <div className="user-box menu-icon-box">
          <div className="bag-icon">
            <Link className="text-muted" href="#">
              <ProfileImage />
            </Link>
          </div>
          <div className="dropdown user-dropdown corner-triangle top-right">
            <ul className="user-dropdown-menu">
              <li className="dropdown-user-info">
                <Link href="/dashboard/notices">
                  <LoginUserDropDown />
                </Link>
              </li>
              {dropdownNavItem?.filter(nav=> (nav.isAdminOnly && Number(session.user.role)) || !nav.isAdminOnly  ).map((item) => (
                <li key={item.href} className="user-dropdown-menu-item">
                  <Link href={item.href}>
                    <span>{item.icon}</span>
                    {item.text}
                  </Link>
                </li>
              ))}
              <SignOut />
            </ul>
          </div>
        </div>
        {/* supportBoard */}
        {supportBoard?.supportBoard && (
          <>
            <Script
              type="text/javascript"
              src={`https://upspot.org/${supportBoard?.supportBoard}/js/min/jquery.min.js`}
            />
            <Script
              id="sbinit"
              type="text/javascript"
              src={`https://upspot.org/${supportBoard?.supportBoard}/js/main.js`}
            />
          </>
        )}
      </div>
    </>
  );
};
export default LoginNav;
