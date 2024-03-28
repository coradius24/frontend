"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "../Icon";

function DropDownItem({ links, label, href, isActive, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const active = isOpen || isActive;
  return (
    <li className={`${active ? "active" : ""} side-nav-item dropdown`}>
      <Link href={href} className="side-nav-link" onClick={toggleNav}>
        <span
          style={{
            height: "16px",
            width: "16px",
            display: "flex",
            marginRight: "10px",
          }}
        >
          <Icon className={icon} />
        </span>
        <span> {label} </span>
        <span className="ms-auto">
          {isOpen ? (
            <Icon className={"fa fa-angle-down"} />
          ) : (
            <Icon className={"fa fa-angle-right"} />
          )}
        </span>
      </Link>
      <ul className={`side-nav-second-level ${isOpen ? "" : "d-none"}`}>
        {links.map((link) => {
          const { label, path, icon } = link;
          let updatePath = `${href}/${path}`;
          if (href.includes(path)) {
            updatePath = href;
          }
          const isActive = updatePath === pathname;
          return (
            <li key={Math.random()}>
              <Link className={isActive ? "active" : ""} href={updatePath}>
                <span
                  style={{
                    height: "16px",
                    width: "16px",
                    display: "flex",
                    marginRight: "10px",
                  }}
                >
                  <Icon className={icon} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
export default DropDownItem;
