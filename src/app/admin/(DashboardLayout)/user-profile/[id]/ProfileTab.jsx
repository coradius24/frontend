"use client";
import { useAdminContext } from "@/app/admin/AdminContext";
import { Box, Tab, Tabs } from "@mui/material";
import {
  IconCoin,
  IconCreditCard,
  IconLockAccess,
  IconScriptPlus,
  IconTools,
  IconUserCircle,
  IconWallet,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const ProfileTab = ({ userId, isStudent }) => {
  const { isFeatureAvailable } = useAdminContext();

  const location = useRouter();
  const pathname = usePathname();

  const [value, setValue] = React.useState(
    pathname?.split("/")?.slice(-1)?.[0]
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ProfileTabs = [
    {
      label: "Profile",
      icon: <IconUserCircle size="20" />,
      to: "profile",
      isAccessible: isFeatureAvailable('get_user_by_id', 'userManagementModule')
    },
    {
      label: isStudent ? "Premium Features" : "Features",
      icon: <IconLockAccess size="20" />,
      to: "features",
      isAccessible: isFeatureAvailable('features_of_a_user', 'userModule')

      // isAdminOnly: true
    },
    {
      label: "Enrollments",
      icon: <IconScriptPlus size="20" />,
      to: "enrollments",
      isAccessible: isFeatureAvailable('enrollments_of_a_user', 'userModule')

    },
    {
      label: "Tools and Resources",
      icon: <IconTools size="20" />,
      to: "tools",
      isAccessible: isFeatureAvailable('tools_access_list_of_user', 'adminToolsModule')

    },

    {
      label: "Payments",
      icon: <IconCreditCard size="20" />,
      to: "payments-history",
      isAccessible: isFeatureAvailable('payments_of_a_user', 'userModule')

    },
    {
      label: "Wallet",
      icon: <IconWallet size="20" />,
      to: "wallet",
      isAccessible: isFeatureAvailable('balance_of_a_user', 'userModule')

    },
    {
      label: "Earning Report & Smart Link",
      icon: <IconCoin size="20" />,
      //  icon: <IconWallet size="20" />,

      to: "earning-report",
      isAccessible: isFeatureAvailable('earning_report_of_a_user', 'userModule')

    },
  ];

  return (
    <Box
      mt={1}
      sx={{ mt: 1, backgroundColor: (theme) => theme.palette.grey[100] }}
    >
      <Box
        justifyContent={"end"}
        display="flex"
        sx={{ maxWidth: { xs: 320, sm: "100%" } }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="scrollable prevent tabs example"
        >
          {ProfileTabs?.filter(ft => ft.isAccessible).map((tab) => {
            return (
              <Tab
                iconPosition="start"
                label={tab.label}
                sx={{ minHeight: "50px" }}
                icon={tab.icon}
                component={Link}
                href={tab.to}
                value={tab.to}
                key={tab.label}
              />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
};

export default ProfileTab;
