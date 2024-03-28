"use client";
import { useState } from "react";

const ReadMore = ({ htmlContent, width }) => {
  const [isExpanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const containerStyle = {
    maxHeight: isExpanded ? "100%" : width,
    overflow: "hidden",
    transition: "max-height 0.3s ease",
  };

  return (
    <>
      <div className="description-content-wrap">
        <div style={containerStyle}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          {!isExpanded && <span>...</span>}
        </div>
      </div>
      {!isExpanded && (
        <div onClick={toggleExpand} className="see-more-button view-more">
          + View more
        </div>
      )}
      {isExpanded && (
        <div onClick={toggleExpand} className="see-more-button view-less">
          - See Less
        </div>
      )}
    </>
  );
};

export default ReadMore;
