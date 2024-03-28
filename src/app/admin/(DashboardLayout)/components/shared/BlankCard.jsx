import { customizer } from "@/utils/admin/theme/constants";
import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const BlankCard = ({ children, className, sx }) => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{
        p: 0,
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
        position: "relative",
        sx,
      }}
      className={className}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? "outlined" : undefined}
    >
      {children}
    </Card>
  );
};

export default BlankCard;
