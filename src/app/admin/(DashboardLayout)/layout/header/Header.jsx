'use client'
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import Notifications from './Notification';
import Profile from './Profile';
import Search from './Search';
import Navigation from './Navigation';
import MobileRightSidebar from './MobileRightSidebar';
import { customizer } from '@/utils/admin/theme/constants';
import { useAdminContext } from '@/app/admin/AdminContext';
import NotificationDropdown from '@/components/header/NotificationDropdown';

const Header = ({renderNotification}) => {
  const {toggleSidebar, toggleMobileSidebar} = useAdminContext()
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // drawer

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        <IconButton
          color="inherit"
          aria-label="menu"
          
          onClick={lgUp ? toggleSidebar : toggleMobileSidebar}
        >
          <IconMenu2 size="20" />
        </IconButton>

        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <Search /> */}
        {lgUp ? (
          <>
            <Navigation />
          </>
        ) : null}

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          
          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          {renderNotification}
          
          {/* ------------------------------------------- */}
          {/* Toggle Right Sidebar for mobile */}
          {/* ------------------------------------------- */}
          {lgDown ? <MobileRightSidebar /> : null}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
