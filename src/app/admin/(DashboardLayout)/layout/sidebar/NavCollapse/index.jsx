import React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"

// mui imports
import {
  ListItemIcon,
  ListItemButton,
  Collapse,
  styled,
  ListItemText,
  useTheme,
  useMediaQuery
} from "@mui/material"

// custom imports
import NavItem from "../NavItem"
import { isNull } from "lodash"

// plugins
import { IconChevronDown, IconChevronUp, IconPoint } from "@tabler/icons-react"
import { customizer } from "@/utils/admin/theme/constants"
import SidebarItemsIconMap from "../SidebarItemsIconMap"

// FC Component For Dropdown Menu
export default function NavCollapse({
  menu,
  level,
  pathWithoutLastPart,
  pathDirect,
  hideMenu,
  onClick,
  
}) {
  const lgDown = useMediaQuery(theme => theme.breakpoints.down("lg"))

  const Icon = SidebarItemsIconMap[menu?.id] || IconPoint;
  const theme = useTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuIcon = Icon && ( level > 1 ? (
    <Icon stroke={1.5} size="1rem" />
  ) : (
    <Icon stroke={1.5} size="1.3rem" />
  ))
   

  const handleClick = () => {
    setOpen(!open)
  }

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false)
    menu?.children?.forEach(item => {
      if (item?.href === pathname) {
        setOpen(true)
      }
    })
  }, [pathname, menu.children])

  const ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: "2px",
    padding: "8px 10px",
    paddingLeft: hideMenu ? "10px" : level > 2 ? `${level * 15}px` : "10px",
    backgroundColor: open && level < 2 ? theme.palette.primary.main : "",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor:
        pathname.includes(menu.href) || open
          ? theme.palette.primary.main
          : theme.palette.primary.light,
      color:
        pathname.includes(menu.href) || open
          ? "white"
          : theme.palette.primary.main
    },
    color:
      open && level < 2
        ? "white"
        : `inherit` && level > 1 && open
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
    borderRadius: `${customizer.borderRadius}px`
  }))

  // If Menu has Children
  const submenus = menu.children?.map(item => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      )
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={lgDown ? onClick : isNull}
        />
      )
    }
  })

  return (
    <>
      <ListItemStyled
        onClick={handleClick}
        selected={pathWithoutLastPart === menu.href}
        key={menu?.id}
      >
        <ListItemIcon
          sx={{
            minWidth: "36px",
            p: "3px 0",
            color: "inherit"
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">
          {hideMenu ? "" : <>{menu.title}</>}
        </ListItemText>
        {!open ? (
          <IconChevronDown size="1rem" />
        ) : (
          <IconChevronUp size="1rem" />
        )}
      </ListItemStyled>
      <Collapse in={open} timeout="auto">
        {submenus}
      </Collapse>
    </>
  )
}
