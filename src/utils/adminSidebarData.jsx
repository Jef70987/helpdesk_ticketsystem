import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView'; // Grid style for dashboards
import PeopleIcon from '@mui/icons-material/People'; // Users management
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // Tickets
import ComputerIcon from '@mui/icons-material/Computer'; // Hardware / IT Assets
import AssessmentIcon from '@mui/icons-material/Assessment'; // Reports / Analytics
import HistoryIcon from '@mui/icons-material/History'; // Audit logs tracking
import LogoutIcon from '@mui/icons-material/Logout'; // Logout

const adminSidebarData = [
  {
    title: 'Dashboard',
    link: '/admin/dashboard',
    icon: <GridViewIcon />
  },
  {
    title: 'Users',
    link: '/admin/users',
    icon: <PeopleIcon />
  },
  {
    title: 'Tickets',
    link: '/admin/tickets',
    icon: <ConfirmationNumberIcon />
  },
  {
    title: 'Hardware',
    link: '/admin/hardware',
    icon: <ComputerIcon />
  },
  {
    title: 'Reports',
    link: '/admin/reports',
    icon: <AssessmentIcon />
  },
  // {
  //   title: 'Audit Log',
  //   link: '/admin/audit-logs',
  //   icon: <HistoryIcon />,
  // },
  {
    title: 'Logout',
    link: '/authPages/logout',
    icon: <LogoutIcon />,
    isLogout: true,
  },
];

export default adminSidebarData;
