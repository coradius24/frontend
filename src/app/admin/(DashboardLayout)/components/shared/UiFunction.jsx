import React from 'react';
import bkash from "@/../public/bkash.svg";
import nagad from "@/../public/nagad.svg";
import rocket from "@/../public/rocket.svg";
import Image from 'next/image';
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

export const getPaymentIcon = (method) => {
  if (method === "Nagad") {
    return <Image alt={method} src={nagad} />;
  } else if (method === "rocket") {
    return <Image alt={method} src={rocket} />;
  }
  return <Image alt={method} src={bkash} />;
};

export const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

