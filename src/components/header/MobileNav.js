"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiMenu } from "react-icons/bi";

const MobileNav = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [hash, setHash] = useState("/");
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuExpanded((prev) => !prev);
  useEffect(() => {
    setHash(window.location.hash);
    return () => {
      setHash(null);
    };
  }, [router]);

  const handleHash = (url) => {
    setHash(url);
  };

  const handleNavItemClick = () => {
    setIsMobileMenuExpanded((prev) => !prev);
  };

  const search = useRef();
  const handleSearch = (e) => {
    e.preventDefault();
    router.replace(`/courses?search=${search.current.value}`);
    router.refresh();
  };

  return (
    <>
      <span
        onClick={toggleMobileMenu}
        className={`${
          session?.user ? "login" : ""
        } large-up-hide menu-button bag-icon`}
      >
        <BiMenu size={30} />
      </span>
      {isMobileMenuExpanded && (
        <div className="expanded-mobile-menu-container">
          <div className="expanded-mobile-menu nav-content">
            <div className="container">
              <ul className="nav-links ">
                <li
                  onClick={handleNavItemClick}
                  className={`${hash === "/" ? "active" : ""} link`}
                >
                  <Link onClick={() => handleHash("/")} href="/">
                    হোম
                  </Link>
                </li>
                <li
                  onClick={handleNavItemClick}
                  className={`${pathname === "/about-us" ? "active" : ""} link`}
                >
                  <Link href={"/about-us"}>আমাদের সম্পর্কে</Link>
                </li>
                <li
                  onClick={handleNavItemClick}
                  className={`${hash === "#category" ? "active" : ""} link`}
                >
                  <Link
                    onClick={() => handleHash("#category")}
                    href={"/home#category"}
                  >
                    কোর্স ক্যাটাগরি
                  </Link>
                </li>
                <li
                  className={`${
                    hash === "#student-feedback" ? "active" : ""
                  } link`}
                  onClick={handleNavItemClick}
                >
                  <Link
                    onClick={() => handleHash("#student-feedback")}
                    href={"/home#student-feedback"}
                  >
                    স্টুডেন্টস ফিডব্যাক
                  </Link>
                </li>
                <div className="header-input">
                  <div className="header-search-box">
                    <search>
                      <form onSubmit={handleSearch}>
                        <input
                          name="search"
                          ref={search}
                          type="text"
                          placeholder="আপনার কাঙ্খিত কোর্সটি সার্চ করুন"
                        />
                      </form>
                    </search>
                    <img
                      onClick={handleSearch}
                      className="search-icon"
                      src="/search.svg"
                      alt="search-icon"
                    />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
