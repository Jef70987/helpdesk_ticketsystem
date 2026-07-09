import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView'; // Dashboard grid layout
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // Tickets
import LogoutIcon from '@mui/icons-material/Logout'; // Logout
import ChatIcon from '@mui/icons-material/Chat'; // Messages

const agentSidebarData = [
  {
    title: 'Dashboard',
    link: '/agent/dashboard',
    icon: <GridViewIcon />
  },
  {
    title: 'Tickets',
    link: '/agent/tickets',
    icon: <ConfirmationNumberIcon />
  },
  // {
  //   title: 'Messages',
  //   link: '/agent/messages',
  //   icon: <ChatIcon />
  // },
  {
    title: 'Logout',
    link: '/auth/logout',
    icon: <LogoutIcon />,
    isLogout: true
  },
  
];

export default agentSidebarData;
