"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DropDownItem from "./DropDownItem";
import "./navigation.css";

export const filterLinks = (links, availableFeature = []) => {
  return links.filter((link) => {
    if (link.id) {
      return availableFeature.some((feature) => feature.id === link.id);
    }
    return true;
  });
};

const Navigation = ({ navLinks = [], availableFeature }) => {
  const [sidebarLinks, setSidebarLinks] = useState(() => {
    const filteredLinks = filterLinks(navLinks, availableFeature);
    return filteredLinks;
  });
  const pathname = usePathname();
  return (
    <>
      {sidebarLinks.map((link) => {
        const { external, label, path, icon, links } = link;

        let href = `/dashboard/${path}`;
        if (external) {
          if (path.includes("https://")) {
            href = path;
          } else {
            href = `/${path}`;
          }
        }
        const isActive = pathname.includes(href);
        return links ? (
          <DropDownItem
            key={href}
            links={links}
            label={label}
            href={href}
            isActive={isActive}
            icon={icon}
          />
        ) : (
          <li key={href} className={`${isActive ? "active" : ""}`}>
            <Link href={href}>
              <span
                style={{
                  display: "flex",
                  marginRight: "5px",
                }}
              >
                {icon}
              </span>
              <span className="menu-text">{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export default Navigation;
