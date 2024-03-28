import React from "react"
import Link from "next/link"

// mui imports
import {
  ListItemIcon,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
  ListItemButton,
  useMediaQuery
} from "@mui/material"
import { customizer } from "@/utils/admin/theme/constants"
import SidebarItemsIconMap from "../SidebarItemsIconMap"
import { IconPoint } from "@tabler/icons-react"

export default function NavItem({
  item,
  level,
  pathDirect,
  hideMenu,
  onClick
}) {
  const lgDown = useMediaQuery(theme => theme.breakpoints.down("lg"))
  const Icon = SidebarItemsIconMap[item?.id] || item.Icon || IconPoint;
  const theme = useTheme()
  const itemIcon = Icon && (level > 1 ? (
    <Icon stroke={1.5} size="1rem" />
  ) : (
    <Icon stroke={1.5} size="1.3rem" />
  ))


  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "8px 10px",
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    paddingLeft: hideMenu ? "10px" : level > 2 ? `${level * 15}px` : "10px",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white"
      }
    }
  }))

  const listItemProps = {
    component: item?.external ? "a" : Link,
    to: item?.href,
    href: item?.external ? item?.href : "",
    target: item?.external ? "_blank" : ""
  }
  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <Link href={item.href || '#'}>
        <ListItemStyled
          // {...listItemProps}
          disabled={item?.disabled}
          selected={pathDirect === item?.href}
          onClick={lgDown ? onClick : undefined}
        >
          <ListItemIcon
            sx={{
              minWidth: "36px",
              p: "3px 0",
              color:
                level > 1 && pathDirect === item?.href
                  ? `${theme.palette.primary.main}!important`
                  : "inherit"
            }}
          >
            {itemIcon}
          </ListItemIcon>
          <ListItemText>
            {hideMenu ? "" : <>{item?.title}</>}
            <br />
            {item?.subtitle ? (
              <Typography variant="caption">
                {hideMenu ? "" : item?.subtitle}
              </Typography>
            ) : (
              ""
            )}
          </ListItemText>

          {!item?.chip || hideMenu ? null : (
            <Chip
              color={item?.chipColor}
              variant={item?.variant ? item?.variant : "filled"}
              size="small"
              label={item?.chip}
            />
          )}
        </ListItemStyled>
      </Link>
    </List>
  )
}
