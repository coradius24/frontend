import Link from "next/link";
import { BiSolidPhone } from "react-icons/bi";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-bottom">
      <div className="container">
        <div className="footer-bottom-content flex">
          <div className="footer-logo">
            <img src="/footer-logo.png" alt="up spot academy" />
            <p>
              আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র।
              বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে
              কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।
            </p>
          </div>
          <div className="footer-company">
            <h6>হেল্পফুল লিংকস</h6>
            <Link href="/courses">সকল কোর্স</Link>
            <Link href={"/about-us"}>আমাদের সম্পর্কে </Link>
            <Link href="/reviews">স্টুডেন্ট ফিডব্যাক </Link>
            <Link href="/blog">আমাদের ব্লগ</Link>
          </div>
          <div className="footer-navigation">
            <h6>নেভিগেশন</h6>
            <Link href="/free-class-registration">ফ্রী লাইভ ক্লাস </Link>
            <Link href="/terms-and-conditions">টার্মস এন্ড কন্ডিশন </Link>
            <Link href="/refund-policy">রিফান্ড পলিসি </Link>
            <Link href="/privacy-policy">প্রাইভেসি পলিসি </Link>
          </div>
          <div className="footer-contact">
            <h6>যোগাযোগ করুন</h6>
            <div className="footer-contact-item d-flex">
              <div className="footer-icon">
                <BiSolidPhone />{" "}
              </div>
              <div>
                <span>
                  <a href="tel:+8801321146224">+8801321 146 224</a>
                </span>
                <span>
                  <a href="tel:+8801321146225">+8801321 146 225</a>
                </span>
              </div>
            </div>
            <div className="footer-contact-item d-flex">
              <div className="footer-icon">
                <HiOutlineMail />
              </div>
              <a href="mailto:info@upspotacademy.com">info@upspotacademy.com</a>
            </div>
            <div className="footer-contact-item d-flex">
              <div className="footer-icon">
                <IoLocationSharp />
              </div>
              <p>
                2nd floor, House #25, Road #05, <br /> Sector #06, Uttara,
                Dhaka-1230
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          <div className="copyright-content d-flex">
            <p>&copy; {new Date().getFullYear()} UpSpot Academy</p>
            <div className="copyright-icons d-flex">
              <Link
                href="https://www.facebook.com/UpSpotAcademy"
                target="_blank"
                className="social"
              >
                <FaFacebookF />
              </Link>
              <Link scroll={false} href="#" className="social">
                <FaTwitter />
              </Link>
              <Link scroll={false} href="#" className="social">
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const helpLinks = [
  { href: "/about-us", text: "About us" },
  { href: "/privacy-policy", text: "Privacy policy" },
  { href: "/terms-and-condition", text: "Terms and condition" },
  { href: "/refund-policy", text: "Refund policy" },
];

const useFullLinks = [
  { href: "/courses", text: "একাডেমিক কোর্স" },
  { href: "/blog", text: "আমাদের ব্লগ" },
  { href: "/free-class-registration", text: "Join Free Class" },
  { href: "/contact-us", text: "Contact Us" },
];
