import logo from "@/assets/img/header-logo.png";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import LinkButton from "../button/LinkButton";
import Cart from "../header/Cart";
import LoginNav from "../header/LoginNav";
import MobileNav from "../header/MobileNav";
import NavBar from "../header/NavBar";
import Search from "../header/Search";
import "./header.css";

const Header = async () => {
  const session = await getServerSession();
  return (
    <header>
      <nav>
        <div className="nav-content container flex">
          <Link href="/" className="brand-logo">
            <Image src={logo} width={170} height={62} alt="brand-logo" />
          </Link>
          <NavBar />
          <div className="header-input">
            <div>
              {" "}
              {!session?.user && (
                <LinkButton
                  url={"/login"}
                  text=" লগ ইন"
                  className="login-btn btn nav-btn large-hide"
                />
              )}
            </div>
            <Search />
            <li className="nav-dropdown">
              <Cart />
            </li>

            {session?.user ? (
              <LoginNav />
            ) : (
              <LinkButton
                url={"/login"}
                text=" লগ ইন / সাইন আপ"
                className="login-btn btn nav-btn small-hide medium-hide"
              />
            )}
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
