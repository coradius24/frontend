"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineArrowDropDown } from "react-icons/md";

const NavBar = () => {
  const pathname = usePathname();
  const { status } = useSession();
 
  return (
    <ul className="nav-links medium-hide small-hide">
      <li className={`${pathname === "/" ? "active" : ""} link`}>
        <Link href="/">হোম</Link>
      </li>
      <li className={`${pathname === "/about-us" ? "active" : ""} link`}>
        <Link href={"/about-us"}>আমাদের সম্পর্কে</Link>
      </li>
      <li
        className={`${
          pathname === "/courses" || pathname.includes("/courses")
            ? "active"
            : ""
        } link nav-dropdown`}
      >
        <Link href={"/courses"}>
          কোর্স{" "}
          <span>
            <MdOutlineArrowDropDown size={20} />
          </span>
        </Link>

        <div className="dropdown-content">
          <div className="dropdown-nav-items">
            <Link
              href="/courses/live"
              className={`${pathname === "/courses/live" ? "active" : ""}`}
            >
              লাইভ কোর্স
            </Link>
            <Link
              href="/courses/recorded"
              className={`${pathname === "/courses/recorded" ? "active" : ""}`}
            >
              রেকর্ডেড কোর্স
            </Link>
          </div>
        </div>
      </li>
      <li
        className={`${pathname === "#student-feedback" ? "active" : ""} link`}
      >
        <Link href={"/#student-feedback"}>স্টুডেন্টস ফিডব্যাক</Link>
      </li>
      {status === "authenticated" && (
        <li className={`${pathname === "/notices" ? "active" : ""} link`}>
          <Link href={"/notices"}>নোটিশবোর্ড</Link>
        </li>
      )}
    </ul>
  );
};

export default NavBar;
