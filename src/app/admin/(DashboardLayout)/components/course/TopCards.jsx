import { Box, CardContent, Grid, Typography } from "@mui/material";

import { BsCardChecklist } from "react-icons/bs";

const topcards = [
  {
    icon: <BsCardChecklist size={35} />,
    title: "Total course",
    digits: "96",
    bgColor: "primary",
  },
  {
    icon: <BsCardChecklist size={35} />,
    title: "Pending Course",
    digits: "3,650",
    bgColor: "warning",
  },
  {
    icon: <BsCardChecklist size={35} />,
    title: "Free Course",
    digits: "356",
    bgColor: "secondary",
  },
  {
    icon: <BsCardChecklist size={35} />,
    title: "Paid Course",
    digits: "696",
    bgColor: "error",
  },
];

const TopCards = ({ data = topcards }) => {
  return (
    <Grid container spacing={3} mt={3}>
      {data.map((topCard, i) => (
        <Grid maxWidth={"100%"} item xs={12} sm={12} md={3} lg={3} key={i}>
          <Box bgcolor={topCard.bgColor + ".light"} textAlign="center">
            <CardContent>
              {topCard.icon}
              <Typography
                color={topCard.bgColor + ".main"}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topCard.title}
              </Typography>
              <Typography
                color={topCard.bgColor + ".main"}
                variant="h4"
                fontWeight={600}
              >
                {topCard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
