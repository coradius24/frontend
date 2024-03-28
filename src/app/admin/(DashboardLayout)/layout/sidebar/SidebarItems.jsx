import { useAdminContext } from "@/app/admin/AdminContext";
import { Box, List, useMediaQuery } from "@mui/material";
import { IconLayoutDashboard } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import NavCollapse from "./NavCollapse";
import NavGroup from "./NavGroup/NavGroup";
import NavItem from "./NavItem";

const SidebarItems = () => {
  const {
    isSidebarCollapsed,
    isSidebarHovered,
    toggleMobileSidebar,
    features,
  } = useAdminContext();
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp ? isSidebarCollapsed && !isSidebarHovered : "";

  return (
    <Box sx={{ px: 3 , mt: 3}}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        <NavItem
          item={{
            // navlabel: ,
            Icon: IconLayoutDashboard,
            title: "Dashboard",
            label: "Dashboard",
            id:"dashboard",
            href: '/admin'
          }}
          hideMenu={hideMenu}
        />

        {features?.adminSidebar?.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return (
              <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />
            );

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item.children?.length) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={toggleMobileSidebar}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => console.log("Nav item todo")}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
