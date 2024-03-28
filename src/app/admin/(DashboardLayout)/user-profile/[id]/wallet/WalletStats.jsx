import { Box, CardContent, Grid, Typography } from "@mui/material";

const WalletStats = ({ currentBalance, totalEarnings, withdrawnTotal }) => {
  const data = [
    {
      title: "Total Earning",
      digits: totalEarnings?.toFixed(2) || "0",
      bgColor: "primary",
    },
    {
      title: "Withdrawn",
      digits: withdrawnTotal?.toFixed(2) || "0",
      bgColor: "warning",
    },
    {
      title: "Current Balance",
      digits: currentBalance?.toFixed(2) || "0",
      bgColor: "secondary",
    },
  ];

  return (
    <Grid container spacing={3} mb={3}>
      {data.map((topCard, i) => (
        <Grid maxWidth={"100%"} item xs={12} sm={12} md={4} lg={4} key={i}>
          <Box bgColor={topCard.bgColor + ".light"} textAlign="center">
            <CardContent>
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
                $ {topCard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default WalletStats;
