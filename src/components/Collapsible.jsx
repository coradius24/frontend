"use client";
import { useState } from "react";
import "./Collapsible.css";

const Collapsible = ({ title, contentPosition = "left", children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`collapsible ${isOpen ? "open" : ""}`}>
      <div
        className={`collapsible-header lecture-group-title clearfix ${
          isOpen ? "collapsed" : ""
        }`}
        style={{ borderRadius: "10px 10px 0px 0px" }}
        aria-expanded={isOpen ? true : false}
        onClick={toggleCollapsible}
      >
        {title}
      </div>
      <div className="collapsible-content">
        <div
          className={`lecture-list collapse collapsible ${
            isOpen ? "show" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;
