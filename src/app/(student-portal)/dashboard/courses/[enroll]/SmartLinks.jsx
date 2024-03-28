'use client'
import { Button } from "@/components/button/LinkButton";
import { showToast } from "@/utils/lib";
import { linkClasses, Popover, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { HiLink } from "react-icons/hi";
import CourseResourceItem from "./CourseResourceItem";
function copyToClipboard(copyText) {
  navigator.clipboard.writeText(copyText);
  showToast('Copied to clipboard')
  // Alert the copied text
}

const SmartLinks = ({ links = [] }) => {
  


  return (
    <div className="recourse-and-tools">
      <h5 style={{
        fontSize: '18px',
        marginBottom: '10px',
        fontWeight: 500
      }}>স্মার্টলিংক</h5>

      {links?.map((item, i) => {
        return (
          <CourseResourceItem
            className="smart-links"
            icon={<HiLink size={26} />}

            key={i}
          >

            <p style={item?.status !== 'active' ? { color: '#f44336' } : {}}>{item?.url}</p>
            {item?.status === 'active' ? <Button onClick={() => copyToClipboard(item?.url)} className="btn-info" text={"কপি করুন "} size={20} /> : (


              <Tooltip title={"Self click ditected, you cliked the link by your self"}>
                <button

                  // onClick={openPopover} 
                  style={{
                    border: '#f44336',
                    background: '#f44336',
                    color: 'white',
                    padding: '8px'
                  }}
                  className="btn-info btn-error" size={20}
                >Blocked</button>
              </Tooltip>
            )
            }

          </CourseResourceItem>
        );
      })}
    </div>
  );
};

export default SmartLinks;
